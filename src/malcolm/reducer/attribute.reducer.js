import { processNavigationLists } from './navigation.reducer';
import LayoutReducer from './layout.reducer';
import blockUtils from '../blockUtils';
import createReducer from './createReducer';
import {
  MalcolmAttributeData,
  MalcolmMainAttributeUpdate,
} from '../malcolm.types';

export const updateAttributeChildren = attribute => {
  const updatedAttribute = { ...attribute };
  if (updatedAttribute.meta) {
    // Find children for the layout attribute
    if (updatedAttribute.meta.elements && updatedAttribute.meta.elements.mri) {
      updatedAttribute.children = updatedAttribute.value.mri;
    }
  }

  return updatedAttribute;
};

export const checkForFlowGraph = attribute => {
  if (blockUtils.attributeHasTag(attribute, 'widget:flowgraph')) {
    const updatedAttribute = { ...attribute };
    const { value } = updatedAttribute;
    updatedAttribute.layout = {
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
    } else if (oldAttribute.meta) {
      oldMeta = oldAttribute.meta;
      newMeta = newAttribute.meta;
    } else {
      return true;
    }

    if (oldMeta.label !== newMeta.label) {
      return true;
    }

    if (oldAttribute.meta.tags) {
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
      .map(nav => nav.path)
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

  return layout;
};

export function updateAttribute(oldState, payload) {
  if (payload.delta) {
    const state = oldState;

    const { path } = state.messagesInFlight[payload.id];
    const blockName = path[0];
    const attributeName = path[1];

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
          loading: false,
          path,
          ...payload,
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

        attributes[matchingAttributeIndex] = checkForFlowGraph(
          attributes[matchingAttributeIndex]
        );

        attributes[matchingAttributeIndex] = updateAttributeChildren(
          attributes[matchingAttributeIndex]
        );

        if (attributes[matchingAttributeIndex].localState !== undefined) {
          if (
            !attributes[matchingAttributeIndex].localState.flags.table.dirty ||
            JSON.stringify(attributes[matchingAttributeIndex].state.value) ===
              JSON.stringify(
                attributes[matchingAttributeIndex].localState.value
              )
          ) {
            attributes[matchingAttributeIndex].localState = {
              value: JSON.parse(
                JSON.stringify(attributes[matchingAttributeIndex].state.value)
              ),
              meta: JSON.parse(
                JSON.stringify(attributes[matchingAttributeIndex].state.meta)
              ),
              labels: Object.keys(
                attributes[matchingAttributeIndex].state.meta.elements
              ),
              flags: {
                rows: [],
                table: {
                  fresh: true,
                },
                timeStamp: JSON.parse(
                  JSON.stringify(
                    attributes[matchingAttributeIndex].state.timeStamp
                  )
                ),
              },
            };
          } else {
            attributes[
              matchingAttributeIndex
            ].localState.flags.table.fresh = false;
          }
        }
      }
      const blocks = { ...state.blocks };
      blocks[blockName] = { ...state.blocks[blockName], attributes };

      const updatedState = {
        ...state,
        blocks,
      };

      // update the navigation if the attribute was part of the path
      const navigation = updateNavigation(updatedState, attributeName);

      const layout = updateLayout(
        state,
        updatedState,
        blockName,
        attributeName
      );

      return {
        ...updatedState,
        layout,
        navigation,
      };
    }
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
  }
);

export default AttributeReducer;
