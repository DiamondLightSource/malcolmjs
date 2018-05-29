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

      return {
        ...state,
        blocks,
      };
    }
  }

  return state;
}

function setMainAttribute(state, payload) {
  return {
    ...state,
    mainAttribute: payload.attribute,
  };
}

export default {
  updateAttribute,
  setMainAttribute,
};
