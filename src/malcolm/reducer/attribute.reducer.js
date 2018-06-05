import { processNavigationLists } from './navigation.reducer';
import LayoutReducer from './layout.reducer';

function updateAttributeChildren(attribute) {
  const updatedAttribute = { ...attribute };
  if (updatedAttribute.meta) {
    // Find children for the layout attribute
    if (updatedAttribute.meta.elements && updatedAttribute.meta.elements.mri) {
      updatedAttribute.children = updatedAttribute.value.mri;
    }
  }

  return updatedAttribute;
}

function checkForFlowGraph(attribute) {
  if (
    attribute &&
    attribute.meta &&
    attribute.meta.tags &&
    attribute.meta.tags.some(t => t === 'widget:flowgraph')
  ) {
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
}

function portsAreDifferent(oldAttribute, newAttribute) {
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
}

function updateAttribute(state, payload) {
  if (payload.delta) {
    const { path } = state.messagesInFlight.find(m => m.id === payload.id);
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
          pending: false,
          ...payload,
        };

        attributes[matchingAttribute] = checkForFlowGraph(
          attributes[matchingAttribute]
        );

        attributes[matchingAttribute] = updateAttributeChildren(
          attributes[matchingAttribute]
        );
      }
      const blocks = { ...state.blocks };
      blocks[blockName] = { ...state.blocks[blockName], attributes };

      // update the navigation if the attribute was part of the path
      let { navigation } = state;
      if (
        state.navigation
          .map(nav => nav.path)
          .findIndex(navPath => navPath === attributeName) > -1
      ) {
        navigation = processNavigationLists(
          state.navigation.map(nav => nav.path),
          blocks
        );
      }

      let { layout } = state;

      const updatedState = {
        ...state,
        blocks,
        navigation,
      };

      if (attributeName === 'layout') {
        layout = LayoutReducer.processLayout(updatedState);
      }

      if (
        matchingAttribute > -1 &&
        attributes[matchingAttribute].meta &&
        attributes[matchingAttribute].meta.tags
      ) {
        if (
          attributes[matchingAttribute].meta.tags.some(t => t === 'widget:icon')
        ) {
          layout = LayoutReducer.processLayout(updatedState);
        } else if (
          (attributes[matchingAttribute].meta.tags.some(
            t => t.indexOf('inport:') > -1
          ) ||
            attributes[matchingAttribute].meta.tags.some(
              t => t.indexOf('outport:') > -1
            )) &&
          portsAreDifferent(
            state.blocks[blockName].attributes[matchingAttribute],
            attributes[matchingAttribute]
          )
        ) {
          layout = LayoutReducer.processLayout(updatedState);
        }
      }

      return {
        ...updatedState,
        layout,
      };
    }
  }

  return state;
}

function setMainAttribute(state, payload) {
  let { layout } = state;
  if (payload.mainAttribute === 'layout') {
    layout = LayoutReducer.processLayout(state);
  }

  return {
    ...state,
    mainAttribute: payload.attribute,
    layout,
  };
}

export default {
  updateAttribute,
  setMainAttribute,
};
