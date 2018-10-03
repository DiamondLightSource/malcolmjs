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
import { malcolmTypes } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import {
  shouldClearDirtyFlag,
  tableHasColumn,
  tableHasRow,
} from './table.reducer';
import { getMethodParam } from './method.reducer';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { sinkPort, sourcePort } from '../malcolmConstants';

export const updateAttributeChildren = attribute => {
  const updatedAttribute = { ...attribute };
  if (updatedAttribute.raw && updatedAttribute.raw.meta) {
    // Find children for the layout attribute
    if (
      updatedAttribute.raw.meta.elements &&
      updatedAttribute.raw.meta.elements.name
    ) {
      updatedAttribute.calculated.children = updatedAttribute.raw.value.name;
    }
  }

  return updatedAttribute;
};

const hasSubElements = inputAttribute => {
  const attribute = inputAttribute;
  if (blockUtils.attributeHasTag(attribute, 'widget:table')) {
    attribute.calculated.subElements = {
      row: tableHasRow,
      col: tableHasColumn,
    };
  } else if (attribute.raw.typeid === 'malcolm:core/Method:1.0') {
    attribute.calculated.subElements = {
      takes: (param, method) => getMethodParam('takes', param, method),
      returns: (param, method) => getMethodParam('returns', param, method),
    };
  }
  return attribute;
};

export const checkForFlowGraph = attribute => {
  if (blockUtils.attributeHasTag(attribute, 'widget:flowgraph')) {
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
    // #refactorDuplication
    if (oldAttribute.raw && oldAttribute.raw.meta) {
      oldMeta = oldAttribute.raw.meta;
      newMeta = newAttribute.raw.meta;
      /* } else if (oldAttribute.meta) {
      oldMeta = oldAttribute.meta;
      newMeta = newAttribute.meta; */
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

export const updateNavigation = (state, attributeName) => {
  let { navigation } = state;
  if (
    navigation.navigationLists.findIndex(
      nav => nav.path.split('.')[0] === attributeName
    ) > -1
  ) {
    navigation = processNavigationLists(
      state.navigation.navigationLists.map(
        nav =>
          nav.subElements ? [nav.path, ...nav.subElements].join('.') : nav.path
      ),
      state.blocks
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

  // #refactorDuplication
  if (
    attribute &&
    ((attribute.raw &&
      attribute.raw.meta &&
      attribute.raw.meta.tags.some(t => t === 'widget:flowgraph')) ||
      (attribute.meta &&
        attribute.meta.tags.some(t => t === 'widget:flowgraph')))
  ) {
    layout = LayoutReducer.processLayout(updatedState);
    return layout;
  }

  if (blockUtils.attributeHasTag(attribute, 'widget:icon')) {
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

const deepCopy = value =>
  value !== undefined ? JSON.parse(JSON.stringify(value)) : undefined;

const updateLocalState = attribute => {
  let updatedAttribute = { ...attribute };
  if (updatedAttribute && updatedAttribute.raw.meta) {
    if (
      updatedAttribute.raw.meta.tags &&
      updatedAttribute.raw.meta.tags.includes('widget:textinput') &&
      (!updatedAttribute.calculated.dirty ||
        updatedAttribute.calculated.forceUpdate)
    ) {
      updatedAttribute.localState = updatedAttribute.raw.value;
    } else if (
      updatedAttribute.raw.meta.typeid === malcolmTypes.table &&
      updatedAttribute.localState !== undefined
    ) {
      const labels = Object.keys(updatedAttribute.raw.meta.elements);
      updatedAttribute = shouldClearDirtyFlag(updatedAttribute);
      if (
        !updatedAttribute.calculated.dirty ||
        updatedAttribute.calculated.forceUpdate
      ) {
        updatedAttribute.calculated.dirty = false;
        updatedAttribute.localState = {
          value: updatedAttribute.raw.value[labels[0]].map((value, row) => {
            const dataRow = {};
            labels.forEach(label => {
              dataRow[label] = updatedAttribute.raw.value[label][row];
            });
            return dataRow;
          }),
          meta: deepCopy(updatedAttribute.raw.meta),
          labels,
          flags: {
            rows: updatedAttribute.raw.value[labels[0]].map(() => ({})),
            table: {
              dirty: false,
              fresh: true,
              timeStamp: deepCopy(updatedAttribute.raw.timeStamp),
            },
          },
        };
      } else {
        updatedAttribute.localState.flags.table.fresh = false;
      }
    }
  }
  return updatedAttribute;
};

const checkForSpecialCases = inputAttribute => {
  let attribute = checkForFlowGraph(inputAttribute);
  attribute = updateAttributeChildren(attribute);
  attribute = hasSubElements(attribute);
  attribute = updateLocalState(attribute);

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
  const dateObject = new Date(
    payload.raw.timeStamp.secondsPastEpoch * 1000 +
      payload.raw.timeStamp.nanoseconds / 1000000
  );
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
    else if (attributeArchive.meta.tags.includes('widget:combo')) {
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
        if (payload.raw.timeStamp) {
          attribute.calculated.timeStamp = new Date(
            payload.raw.timeStamp.secondsPastEpoch * 1000 +
              payload.raw.timeStamp.nanoseconds / 1000000
          ).toISOString();
        }
        attributes[matchingAttributeIndex] = checkForSpecialCases(attribute);

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
          archive[matchingAttributeIndex] = pushToArchive(
            attributeArchive,
            payload,
            alarmState
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
        const navigation = updateNavigation(updatedState, attributeName);
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

  for (let i = 0; i < payload.actions.length; i += 1) {
    const innerPayload = payload.actions[i].payload;
    const { path } = updatedState.messagesInFlight[innerPayload.id];
    const attributeName = path[1];

    const navigation = updateNavigation(updatedState, attributeName);

    if (navigation !== updatedState.navigation) {
      updatedState.navigation = navigation;
      break;
    }
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

      attributes[matchingAttributeIndex] = checkForSpecialCases(attribute);
    }
    const blocks = { ...state.blocks };
    blocks[blockName] = { ...state.blocks[blockName], attributes };

    let updatedState = {
      ...state,
      blocks,
    };

    // update the navigation if the attribute was part of the path
    const navigation = updateNavigation(updatedState, attributeName);

    const layout = updateLayout(state, updatedState, blockName, attributeName);

    updatedState = {
      ...updatedState,
      layout,
      navigation,
    };

    return navigationReducer.updateNavTypes(updatedState);
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
