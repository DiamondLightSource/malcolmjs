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
  if (oldAttribute && oldAttribute.meta) {
    if (oldAttribute.meta.label !== newAttribute.meta.label) {
      return true;
    }

    if (oldAttribute.meta.tags) {
      // find inport and compare
      const inPortTag = newAttribute.meta.tags.find(
        t => t.indexOf('inport:') > -1
      );
      if (
        inPortTag !== undefined &&
        oldAttribute.meta.tags.findIndex(t => t === inPortTag) === -1
      ) {
        return true;
      }

      // find outport and compare
      const outPortTag = newAttribute.meta.tags.find(
        t => t.indexOf('outport:') > -1
      );
      if (
        outPortTag !== undefined &&
        oldAttribute.meta.tags.findIndex(t => t === outPortTag) === -1
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
  const matchingAttribute = attributes.findIndex(a => a.name === attributeName);

  if (matchingAttribute < 0) {
    return layout;
  }

  const attribute = attributes[matchingAttribute];

  if (
    attribute &&
    attribute.meta &&
    attribute.meta.tags.some(t => t === 'widget:flowgraph')
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

      const matchingAttribute = attributes.findIndex(
        a => a.name === attributeName
      );
      if (matchingAttribute >= 0) {
        attributes[matchingAttribute] = {
          ...attributes[matchingAttribute],
          loading: false,
          path,
          ...payload,
        };

        attributes[matchingAttribute] = checkForFlowGraph(
          attributes[matchingAttribute]
        );

        attributes[matchingAttribute] = updateAttributeChildren(
          attributes[matchingAttribute]
        );

        if (attributes[matchingAttribute].localState !== undefined) {
          if (!attributes[matchingAttribute].localState.flags.table.dirty) {
            attributes[matchingAttribute].localState = {
              value: JSON.parse(
                JSON.stringify(attributes[matchingAttribute].value)
              ),
              labels: Object.keys(attributes[matchingAttribute].meta.elements),
              flags: {
                rows: {},
                table: {
                  fresh: true,
                },
                timeStamp: JSON.parse(
                  JSON.stringify(attributes[matchingAttribute].timeStamp)
                ),
              },
            };
          } else {
            attributes[matchingAttribute].localState.flags.table.fresh = false;
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
