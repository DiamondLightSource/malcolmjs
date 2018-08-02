/* eslint no-underscore-dangle: 0 */
import navigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import LayoutReducer from './layout.reducer';
import blockUtils from '../blockUtils';
import createReducer from './createReducer';
import {
  MalcolmAttributeData,
  MalcolmMainAttributeUpdate,
  MalcolmRevert,
} from '../malcolm.types';
import { malcolmTypes } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import {
  shouldClearDirtyFlag,
  tableHasColumn,
  tableHasRow,
} from './table.reducer';

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
  } /* else if (attribute.raw.typeid === 'malcolm:core/Method:1.0') {
    attribute.calculated.subElements = {
      takes: param => getMethodParam('takes', param),
      returns: param => getMethodParam('returns', param),
    };
  } */
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

    if (oldMeta.label !== newMeta.label) {
      return true;
    }

    if (oldMeta.tags) {
      // find inport and compare
      const inPortTag = newMeta.tags.find(t => t.indexOf('inport:') > -1);
      if (
        inPortTag !== undefined &&
        oldMeta.tags.findIndex(t => t === inPortTag) === -1
      ) {
        return true;
      }

      // find outport and compare
      const outPortTag = newMeta.tags.find(t => t.indexOf('outport:') > -1);
      if (
        outPortTag !== undefined &&
        oldMeta.tags.findIndex(t => t === outPortTag) === -1
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
    navigation.navigationLists
      .map(nav => nav.path.split('.')[0])
      .findIndex(navPath => navPath === attributeName) > -1
  ) {
    navigation = processNavigationLists(
      state.navigation.navigationLists.map(nav => nav.path),
      state.blocks
    );
  }

  return navigation;
};

export const isPort = attribute =>
  blockUtils.attributeHasTag(attribute, 'inport:') ||
  blockUtils.attributeHasTag(attribute, 'outport:');

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

const checkForSpecialCases = inputAttribute => {
  let attribute = checkForFlowGraph(inputAttribute);
  attribute = updateAttributeChildren(attribute);
  attribute = hasSubElements(attribute);

  if (attribute.localState !== undefined) {
    const labels = Object.keys(attribute.raw.meta.elements);
    attribute = shouldClearDirtyFlag(attribute);
    if (!attribute.calculated.dirty || attribute.calculated.forceUpdate) {
      attribute.calculated.dirty = false;
      attribute.localState = {
        value: attribute.raw.value[labels[0]].map((value, row) => {
          const dataRow = {};
          labels.forEach(label => {
            dataRow[label] = attribute.raw.value[label][row];
          });
          return dataRow;
        }),
        meta: JSON.parse(JSON.stringify(attribute.raw.meta)),
        labels,
        flags: {
          rows: attribute.raw.value[labels[0]].map(() => ({})),
          table: {
            dirty: false,
            fresh: true,
            timeStamp: JSON.parse(JSON.stringify(attribute.raw.timeStamp)),
          },
        },
      };
    } else {
      attribute.localState.flags.table.fresh = false;
    }
  }
  return attribute;
};

const pushToArchive = (oldAttributeArchive, payload) => {
  const attributeArchive = oldAttributeArchive;
  if (attributeArchive.connectTime === -1) {
    attributeArchive.connectTime = payload.raw.timeStamp.secondsPastEpoch;
  }
  if (payload.raw.meta.typeid) {
    attributeArchive.typeid = payload.raw.meta.typeid;
  }
  attributeArchive.value.push(payload.raw.value);
  attributeArchive.timeStamp.push(payload.raw.timeStamp.secondsPastEpoch);
  let plotValue = payload.raw.value;
  if (attributeArchive.typeid === malcolmTypes.bool) {
    plotValue = payload.raw.value ? 1 : 0;
  }
  attributeArchive.plotValue.push(plotValue);
  attributeArchive.timeSinceConnect.push(
    payload.raw.timeStamp.secondsPastEpoch -
      attributeArchive.connectTime +
      10 ** -9 * payload.raw.timeStamp.nanoseconds
  );
  attributeArchive.counter += 1;
  attributeArchive.plotTime =
    attributeArchive.timeSinceConnect.toarray().slice(-1)[0] -
      attributeArchive.plotTime >
    0.2
      ? attributeArchive.timeSinceConnect.toarray().slice(-1)[0]
      : attributeArchive.plotTime;
  return attributeArchive;
};

export function updateAttribute(oldState, payload) {
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
        attributes[matchingAttributeIndex] = checkForSpecialCases(attribute);

        if (payload.raw.timeStamp) {
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

      // update the navigation if the attribute was part of the path
      const navigation = updateNavigation(updatedState, attributeName);

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

      const layoutEngine =
        numberOfBlocksLoading < numberOfBlocksWereLoading ||
        (!layoutLoading &&
          LayoutReducer.isRelevantAttribute(attributes[matchingAttributeIndex]))
          ? LayoutReducer.buildLayoutEngine(
              layout,
              updatedState.layoutState.selectedBlocks
            )
          : updatedState.layoutEngine;

      updatedState = {
        ...updatedState,
        layout,
        layoutEngine,
        navigation,
      };

      updatedState = navigationReducer.updateNavTypes(updatedState);

      return updatedState;
    }
  }

  return oldState;
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
          dirty: false,
          forceUpdate: true,
          loading: false,
          path: payload.path,
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
    [MalcolmMainAttributeUpdate]: setMainAttribute,
    [MalcolmRevert]: revertLocalState,
  }
);

export default AttributeReducer;
