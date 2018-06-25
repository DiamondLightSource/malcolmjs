import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType } from '../malcolm.types';

const updateMethodInput = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blocks[blockName];
    const attributeCopy = { ...attributes[matchingAttribute] };
    if (payload.value.isDirty !== undefined) {
      if (!attributes[matchingAttribute].dirtyInputs) {
        attributes[matchingAttribute].dirtyInputs = {};
      }
      attributes[matchingAttribute].dirtyInputs = {
        ...attributeCopy.dirtyInputs,
      };
      attributes[matchingAttribute].dirtyInputs[payload.name] =
        payload.value.isDirty;
    } else {
      attributes[matchingAttribute].inputs = {
        ...attributes[matchingAttribute].inputs,
      };
      attributes[matchingAttribute].inputs[payload.name] = payload.value;
    }
    blocks[payload.path[0]] = { ...state.blocks[payload.path[0]], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const handleMethodReturn = (state, action, path) => {
  const blockName = path[0];
  const attributeName = path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blocks[blockName];
    const valueMap = {};
    const returnKeys = Object.keys(
      attributes[matchingAttribute].returns.elements
    );
    returnKeys.forEach(returnVar => {
      if (action.payload.value[returnVar] !== undefined) {
        valueMap[returnVar] = action.payload.value[returnVar];
      } else if (!(action.payload.value instanceof Object)) {
        valueMap[returnVar] = action.payload.value;
      }
    });

    attributes[matchingAttribute] = {
      ...attributes[matchingAttribute],
      outputs: { ...valueMap },
    };
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

const MethodReducer = createReducer(
  {},
  {
    [MalcolmUpdateMethodInputType]: updateMethodInput,
  }
);

export default MethodReducer;
