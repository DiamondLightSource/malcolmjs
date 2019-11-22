/* eslint no-underscore-dangle: 0 */
import navigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import LayoutReducer from './layout/layout.reducer';
import blockUtils from '../blockUtils';
import createReducer from './createReducer';
import {
  MalcolmAttributeData,
  MalcolmMainAttributeUpdate,
  MalcolmRevert,
  MalcolmTickArchive,
  MalcolmMultipleAttributeData,
  MalcolmSimpleLocalState,
} from '../malcolm.types';
import {
  getDefaultFromType,
  malcolmTypes,
  isArrayType,
  Widget,
} from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import {
  createLocalState,
  shouldClearDirtyFlag,
  tableHasColumn,
  tableHasRow,
  arrayHasElement,
} from './table.reducer';
import { getMethodParam, pushServerRunToArchive } from './method.reducer';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { sinkPort, sourcePort } from '../malcolmConstants';

export const updateAttributeChildren = (attribute, blockList) => {
  const updatedAttribute = { ...attribute };
  if (updatedAttribute.raw && updatedAttribute.raw.meta) {
    // Find children for the layout attribute
    if (
      blockUtils.attributeHasTag(updatedAttribute, Widget.FLOWGRAPH) &&
      updatedAttribute.raw.value
    ) {
      updatedAttribute.raw.value.name.forEach((name, index) => {
        updatedAttribute.calculated.children[name] = {
          label: blockList[updatedAttribute.raw.value.mri[index]]
            ? blockList[updatedAttribute.raw.value.mri[index]].label
            : 'ERROR: block not in global block list',
          mri: updatedAttribute.raw.value.mri[index],
        };
      });
    }
  }

  return updatedAttribute;
};

export const timestamp2Date = timeStamp =>
  new Date(timeStamp.secondsPastEpoch * 1000 + timeStamp.nanoseconds / 1000000);

const hasSubElements = inputAttribute => {
  const attribute = inputAttribute;
  if (blockUtils.attributeHasTag(attribute, Widget.TABLE)) {
    attribute.calculated.subElements = {
      row: tableHasRow,
      col: tableHasColumn,
    };
  } else if (attribute.raw.typeid === 'malcolm:core/Method:1.1') {
    attribute.calculated.subElements = {
      takes: (param, method) => getMethodParam('takes', param, method),
      returns: (param, method) => getMethodParam('returns', param, method),
    };
  } else if (isArrayType(attribute.raw.meta)) {
    attribute.calculated.subElements = {
      row: arrayHasElement,
    };
  }
  return attribute;
};

export const checkForFlowGraph = attribute => {
  if (blockUtils.attributeHasTag(attribute, Widget.FLOWGRAPH)) {
    const updatedAttribute = { ...attribute };
    const { value } = updatedAttribute.raw;
    updatedAttribute.calculated.layout = {
      blocks: value.mri.map((mri, i) => ({
        name: value.name[i],
        mri,
        visible: value.visible[i],
        position: {
          x: value.x[i],
          y: value.y[i],
        },
        ports: [],
        alarmState: AlarmStates.NO_ALARM,
        icon: undefined,
        loading: true,
      })),
    };

    return updatedAttribute;
  }
  return attribute;
};

export const portsAreDifferent = (oldAttribute, newAttribute) => {
  if (oldAttribute) {
    let oldMeta;
    let newMeta;
    if (oldAttribute.raw && oldAttribute.raw.meta) {
      oldMeta = oldAttribute.raw.meta;
      newMeta = newAttribute.raw.meta;
    } else {
      return true;
    }

    if (oldAttribute.raw.value !== newAttribute.raw.value) {
      return true;
    }

    if (oldMeta.label !== newMeta.label) {
      return true;
    }

    if (oldMeta.tags) {
      // find source port and compare
      const inPortTag = newMeta.tags.find(t => t.indexOf(sinkPort) > -1);
      if (
        inPortTag !== undefined &&
        oldMeta.tags.findIndex(t => t === inPortTag) === -1
      ) {
        return true;
      }

      // find sink port and compare
      const sinkPortTag = newMeta.tags.find(t => t.indexOf(sourcePort) > -1);
      if (
        sinkPortTag !== undefined &&
        oldMeta.tags.findIndex(t => t === sinkPortTag) === -1
      ) {
        return true;
      }
    }

    return false;
  }

  return true;
};

export const updateNavigation = (state, attributeName, attribute) => {
  let { navigation } = state;
  const matchingNav = navigation.navigationLists.find(
    nav => nav.path.split('.')[0] === attributeName
  );
  if (
    matchingNav &&
    (matchingNav.children !== attribute.calculated.children ||
      (attribute.raw.meta && matchingNav.label !== attribute.raw.meta.label))
  ) {
    navigation = processNavigationLists(
      state.navigation.navigationLists.map(nav => {
        if (nav.subElements && nav.subElements[0] !== undefined) {
          return [nav.path, ...nav.subElements].join('.');
        } else if (nav.badUrlPart) {
          return [nav.path, ...nav.badUrlPart].join('.');
        }
        return nav.path;
      }),
      state.blocks,
      state.navigation.viewType
    );
  }

  return navigation;
};

export const isPort = attribute =>
  blockUtils.attributeHasTag(attribute, sinkPort) ||
  blockUtils.attributeHasTag(attribute, sourcePort);

export const updateLayout = (state, updatedState, blockName, attributeName) => {
  let { layout } = state;

  const { attributes } = updatedState.blocks[blockName];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );

  if (matchingAttributeIndex < 0) {
    return layout;
  }

  const attribute = attributes[matchingAttributeIndex];

  if (
    attribute &&
    (attribute.raw &&
      attribute.raw.meta &&
      attribute.raw.meta.tags.some(t => t === Widget.FLOWGRAPH) &&
      attribute.calculated.name === state.mainAttribute &&
      attribute.calculated.path[0] === state.parentBlock)
  ) {
    layout = LayoutReducer.processLayout(updatedState);
    return layout;
  }

  if (LayoutReducer.isRelevantAttribute(attribute)) {
    layout = LayoutReducer.processLayout(updatedState);
  } else if (
    isPort(attribute) &&
    portsAreDifferent(
      blockUtils.findAttribute(state.blocks, blockName, attributeName),
      attribute
    )
  ) {
    layout = LayoutReducer.processLayout(updatedState);
  }

  // need to update the loading state of other blocks here
  const oldAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    attributeName
  );
  if (
    (oldAttribute ? oldAttribute.calculated.loading : true) &&
    !attribute.calculated.loading
  ) {
    layout = LayoutReducer.processLayout(updatedState);
  }

  return layout;
};

export const updateLocalState = attribute => {
  let updatedAttribute = { ...attribute };
  if (updatedAttribute && updatedAttribute.raw.meta) {
    if (
      updatedAttribute.raw.meta.tags &&
      updatedAttribute.raw.meta.tags.includes(Widget.TEXTINPUT) &&
      !isArrayType(attribute.raw.meta) &&
      (!updatedAttribute.calculated.dirty ||
        updatedAttribute.calculated.forceUpdate)
    ) {
      updatedAttribute.localState = updatedAttribute.raw.value;
    } else if (
      (updatedAttribute.raw.meta.typeid === malcolmTypes.table ||
        isArrayType(attribute.raw.meta)) &&
      updatedAttribute.localState !== undefined
    ) {
      updatedAttribute = shouldClearDirtyFlag(updatedAttribute);
      if (
        !updatedAttribute.calculated.dirty ||
        updatedAttribute.calculated.forceUpdate
      ) {
        updatedAttribute = createLocalState(updatedAttribute);
        updatedAttribute.calculated.forceUpdate = false;
      } else {
        updatedAttribute.localState.flags.table.fresh = false;
        if (
          !isArrayType(attribute.raw.meta) &&
          !updatedAttribute.localState.flags.table.extendable
        ) {
          updatedAttribute.localState.value.forEach((row, index) => {
            updatedAttribute.localState.labels.forEach(label => {
              const rowCopy = row;
              if (
                !(
                  updatedAttribute.localState.flags.rows[index]._dirty ||
                  updatedAttribute.localState.flags.rows[index]._isChanged
                ) ||
                !updatedAttribute.raw.meta.elements[label].writeable
              ) {
                rowCopy[label] = updatedAttribute.raw.value[label][index];
              }
            });
          });
        }
      }
    }
  }
  return updatedAttribute;
};

export const presetMethodInputs = attribute => {
  const updatedAttribute = attribute;
  if (updatedAttribute && updatedAttribute.calculated.isMethod) {
    if (!updatedAttribute.calculated.inputs) {
      updatedAttribute.calculated.inputs = {};
      updatedAttribute.calculated.outputs =
        updatedAttribute.calculated.outputs || {};
      Object.entries(updatedAttribute.raw.meta.takes.elements).forEach(
        ([input, meta]) => {
          if (
            attribute.raw.took &&
            attribute.raw.took.present.includes(input)
          ) {
            if (
              attribute.raw.meta.takes.elements[input].typeid ===
              malcolmTypes.table
            ) {
              const labels = Object.keys(
                attribute.raw.meta.takes.elements[input].elements
              );
              const columns = {};
              labels.forEach(label => {
                columns[label] = {};
              });
              updatedAttribute.calculated.inputs[input] = {
                meta: JSON.parse(
                  JSON.stringify(attribute.raw.meta.takes.elements[input])
                ),
                value: attribute.raw.took.value[input][labels[0]].map(
                  (value, row) => {
                    const dataRow = {};
                    labels.forEach(label => {
                      dataRow[label] =
                        attribute.raw.took.value[input][label][row];
                    });
                    return dataRow;
                  }
                ),
                labels,
                flags: {
                  columns,
                  rows: attribute.raw.took.value[input][labels[0]].map(
                    () => ({})
                  ),
                  table: {},
                },
              };
            } else if (isArrayType(attribute.raw.meta.takes.elements[input])) {
              updatedAttribute.calculated.inputs[input] = {
                meta: JSON.parse(
                  JSON.stringify(attribute.raw.meta.takes.elements[input])
                ),
                value: attribute.raw.took.value[input],
                flags: { rows: [], table: {} },
              };
            } else {
              updatedAttribute.calculated.inputs[input] = {
                value: attribute.raw.took.value[input],
                flags: {},
              };
            }
          } else if (
            updatedAttribute.raw.meta.takes.required.includes(input) &&
            !updatedAttribute.calculated.inputs[input]
          ) {
            updatedAttribute.calculated.inputs[input] = {
              value: getDefaultFromType(meta),
              flags: {},
            };
          }
        }
      );
    }
  }
  return updatedAttribute;
};

const checkForSpecialCases = (inputAttribute, blockList = {}) => {
  let attribute = checkForFlowGraph(inputAttribute);
  attribute = updateAttributeChildren(attribute, blockList);
  attribute = hasSubElements(attribute);
  attribute = updateLocalState(attribute);
  attribute = presetMethodInputs(attribute);

  return attribute;
};

const popAndPush = (buffer, value) => {
  if (buffer.size() !== 0) {
    buffer.pop();
  }
  buffer.push(value);
  buffer.push(value);
};

export const pushToArchive = (oldAttributeArchive, payload, alarmState) => {
  const attributeArchive = oldAttributeArchive;
  const nanoSeconds =
    payload.raw.timeStamp.secondsPastEpoch +
    10 ** -9 * payload.raw.timeStamp.nanoseconds;
  const dateObject = timestamp2Date(payload.raw.timeStamp);
  if (attributeArchive.connectTime === -1) {
    attributeArchive.connectTime = nanoSeconds;
  }
  if (payload.raw.meta) {
    attributeArchive.meta = { ...attributeArchive.meta, ...payload.raw.meta };
  }
  attributeArchive.value.push(payload.raw.value);
  attributeArchive.timeSinceConnect.push(
    nanoSeconds - attributeArchive.connectTime
  );
  popAndPush(attributeArchive.alarmState, alarmState);
  popAndPush(attributeArchive.timeStamp, dateObject);
  let plotValue = payload.raw.value;
  if (attributeArchive.meta.typeid === malcolmTypes.bool) {
    plotValue = payload.raw.value ? 1 : 0;
    plotValue = payload.raw.value === undefined ? undefined : plotValue;
  }
  /* CODE TO MAP ENUMS TO NUMERICAL VALUE FOR DEFINING ORDER IN PLOT (DISABLED)
        else if (attributeArchive.meta.tags.includes(Widget.COMBO)) {
        plotValue = attributeArchive.meta.choices.findIndex(
          val => val === payload.raw.value
        );
      } */
  popAndPush(attributeArchive.plotValue, plotValue);
  attributeArchive.counter += 1;
  attributeArchive.plotTime =
    attributeArchive.timeSinceConnect.get(
      attributeArchive.timeSinceConnect.size() - 1
    ) -
      attributeArchive.plotTime >
    attributeArchive.refreshRate
      ? attributeArchive.timeSinceConnect.get(
          attributeArchive.timeSinceConnect.size() - 1
        )
      : attributeArchive.plotTime;
  attributeArchive.tickingSince = new Date();
  return attributeArchive;
};

export const tickArchive = (state, payload) => {
  const { path } = payload;
  const blockName = path[0];
  const attributeName = path[1];

  if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
    const blockArchive = { ...state.blockArchive };
    const archive = [...state.blockArchive[blockName].attributes];
    const matchingAttributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    const attributeArchive = { ...archive[matchingAttributeIndex] };
    attributeArchive.timeStamp.pop();
    const newTime = new Date(
      attributeArchive.timeStamp
        .get(attributeArchive.timeStamp.size() - 1)
        .getTime() +
        (new Date() - attributeArchive.tickingSince)
    );
    attributeArchive.timeStamp.push(newTime);
    attributeArchive.plotTime += 1;
    archive[matchingAttributeIndex] = attributeArchive;
    blockArchive[blockName] = { attributes: archive };
    return {
      ...state,
      blockArchive,
    };
  }
  return state;
};

export function updateAttribute(
  oldState,
  payload,
  ignoreSecondaryCalculations
) {
  if (payload.delta) {
    const state = oldState;

    const { path } = state.messagesInFlight[payload.id];
    const blockName = path[0];
    const attributeName = path[1];

    if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
      const attributes = [...state.blocks[blockName].attributes];
      const archive = [...state.blockArchive[blockName].attributes];
      const matchingAttributeIndex = blockUtils.findAttributeIndex(
        state.blocks,
        blockName,
        attributeName
      );
      // #refactorDuplication
      if (matchingAttributeIndex >= 0) {
        const attributeArchive = { ...archive[matchingAttributeIndex] };
        const attribute = {
          ...attributes[matchingAttributeIndex],
          raw: {
            ...attributes[matchingAttributeIndex].raw,
            ...payload.raw,
          },
          calculated: {
            ...attributes[matchingAttributeIndex].calculated,
            ...payload.calculated,
            loading: false,
            path,
            parent: blockName,
          },
        };
        if (attribute.raw.alarm) {
          attribute.calculated.alarms = {
            ...attribute.calculated.alarms,
            rawAlarm:
              attribute.raw.alarm.severity !== AlarmStates.NO_ALARM
                ? attribute.raw.alarm.severity
                : null,
          };
        }

        if (payload.raw.meta && payload.raw.meta.label) {
          state.blocks[blockName].children[attribute.calculated.name].label =
            payload.raw.meta.label;
        }
        if (payload.raw.timeStamp) {
          attribute.calculated.timeStamp = new Date(
            payload.raw.timeStamp.secondsPastEpoch * 1000 +
              payload.raw.timeStamp.nanoseconds / 1000000
          ).toISOString();
        }
        attributes[matchingAttributeIndex] = checkForSpecialCases(
          attribute,
          state.blocks['.blocks'].children
        );

        if (payload.raw.timeStamp) {
          const alarmState =
            attribute.raw.alarm && attribute.raw.alarm.severity
              ? attribute.raw.alarm.severity
              : AlarmStates.NO_ALARM;
          /*
          const nanoSeconds =
            payload.raw.timeStamp.secondsPastEpoch +
            10 ** -9 * payload.raw.timeStamp.nanoseconds;
          localStorage.setItem(
            `${path}:${nanoSeconds}`,
            JSON.stringify(payload.raw.value)
          );
          */
          if (attribute.raw.typeid === 'epics:nt/NTScalar:1.0') {
            archive[matchingAttributeIndex] = pushToArchive(
              attributeArchive,
              payload,
              alarmState
            );
          }
        } else if (
          attribute.calculated.isMethod &&
          !attribute.calculated.isWritableFlip
        ) {
          archive[matchingAttributeIndex] = pushServerRunToArchive(
            attributeArchive,
            payload
          );
        }
      }
      const blocks = { ...state.blocks };
      blocks[blockName] = { ...state.blocks[blockName], attributes };
      const blockArchive = { ...state.blockArchive };
      blockArchive[blockName] = { attributes: archive };

      let updatedState = {
        ...state,
        blocks,
        blockArchive,
      };

      const layout = updateLayout(
        state,
        updatedState,
        blockName,
        attributeName
      );

      const layoutLoading =
        layout && layout.blocks ? layout.blocks.some(b => b.loading) : true;

      const numberOfBlocksLoading = layout.blocks.filter(b => b.loading).length;
      const numberOfBlocksWereLoading = oldState.layout
        ? oldState.layout.blocks.filter(b => b.loading).length
        : 1000000;

      updatedState.layout = layout;

      updatedState.layoutEngine =
        numberOfBlocksLoading !== numberOfBlocksWereLoading ||
        (!layoutLoading &&
          LayoutReducer.isRelevantAttribute(attributes[matchingAttributeIndex]))
          ? LayoutReducer.updateLayoutAndEngine(updatedState, false)
              .layoutEngine
          : updatedState.layoutEngine;

      if (!ignoreSecondaryCalculations) {
        const navigation = updateNavigation(
          updatedState,
          attributeName,
          attributes[matchingAttributeIndex]
        );
        updatedState.navigation = navigation;
        updatedState = navigationReducer.updateNavTypes(updatedState);
      }

      return updatedState;
    }
  }

  return oldState;
}

export function updateMultipleAttributes(oldState, payload) {
  let updatedState = oldState;
  for (let i = 0; i < payload.actions.length; i += 1) {
    const innerPayload = payload.actions[i].payload;

    updatedState = updateAttribute(updatedState, innerPayload);
  }

  updatedState = navigationReducer.updateNavTypes(updatedState);

  return updatedState;
}

export function revertLocalState(oldState, payload) {
  const state = oldState;
  const blockName = payload.path[0];
  const attributeName = payload.path[1];

  if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
    const attributes = [...state.blocks[blockName].attributes];

    const matchingAttributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    if (matchingAttributeIndex >= 0) {
      const attribute = {
        ...attributes[matchingAttributeIndex],
        raw: {
          ...attributes[matchingAttributeIndex].raw,
        },
        calculated: {
          ...attributes[matchingAttributeIndex].calculated,
          errorState: false,
          errorMessage: undefined,
          forceUpdate: true,
          loading: false,
          path: payload.path,
          alarms: {
            ...attributes[matchingAttributeIndex].calculated.alarms,
            errorState: null,
          },
        },
      };

      attributes[matchingAttributeIndex] = checkForSpecialCases(
        attribute,
        state.blocks['.blocks'].children
      );
      // TODO: call processLayout and updateLayoutAndEngine here (if required)
    }
    const blocks = { ...state.blocks };
    blocks[blockName] = { ...state.blocks[blockName], attributes };

    const updatedState = {
      ...state,
      blocks,
    };

    return updatedState;
  }
  return oldState;
}

function writeSimpleLocalState(oldState, payload) {
  const state = oldState;
  const blockName = payload.path[0];
  const attributeName = payload.path[1];

  if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
    const attributes = [...state.blocks[blockName].attributes];

    const matchingAttributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    if (matchingAttributeIndex >= 0) {
      attributes[matchingAttributeIndex] = {
        ...attributes[matchingAttributeIndex],
        localState: payload.value,
      };
    }
    const blocks = { ...state.blocks };
    blocks[blockName] = { ...state.blocks[blockName], attributes };

    return {
      ...state,
      blocks,
    };
  }
  return oldState;
}

function setMainAttribute(state, payload) {
  return {
    ...state,
    mainAttribute: payload.attribute,
  };
}

const AttributeReducer = createReducer(
  {},
  {
    [MalcolmAttributeData]: updateAttribute,
    [MalcolmMultipleAttributeData]: updateMultipleAttributes,
    [MalcolmMainAttributeUpdate]: setMainAttribute,
    [MalcolmRevert]: revertLocalState,
    [MalcolmTickArchive]: tickArchive,
    [MalcolmSimpleLocalState]: writeSimpleLocalState,
  }
);

export default AttributeReducer;
