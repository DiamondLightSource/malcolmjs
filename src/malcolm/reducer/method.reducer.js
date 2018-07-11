import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType, MalcolmReturn } from '../malcolm.types';

const mapReturnValues = (returnKeys, payload) => {
  const valueMap = { outputs: {} };
  returnKeys.forEach(returnVar => {
    if (payload.value[returnVar] !== undefined) {
      valueMap.outputs[returnVar] = payload.value[returnVar];
    } else {
      valueMap.errorState = true;
      valueMap.errorMessage = `MethodError: expected value ${returnVar} missing from return`;
    }
  });
  return valueMap;
};

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
    const attributeCopy = attributes[matchingAttribute];
    if (payload.value.isDirty !== undefined) {
      if (!attributeCopy.calculated.dirtyInputs) {
        attributeCopy.calculated.dirtyInputs = {};
      }
      attributeCopy.calculated.dirtyInputs = {
        ...attributeCopy.calculated.dirtyInputs,
      };
      attributeCopy.calculated.dirtyInputs[payload.name] =
        payload.value.isDirty;
    } else {
      attributeCopy.calculated.inputs = {
        ...attributeCopy.calculated.inputs,
      };
      attributeCopy.calculated.inputs[payload.name] = payload.value;
    }
    attributes[matchingAttribute] = attributeCopy;
    blocks[payload.path[0]] = { ...state.blocks[payload.path[0]], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const handleMethodReturn = (state, payload) => {
  const matchingMessage = state.messagesInFlight[payload.id];
  const path = matchingMessage ? matchingMessage.path : undefined;

  if (path && matchingMessage.typeid === 'malcolm:core/Post:1.0') {
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
      let valueMap = { outputs: {} };
      const returnKeys = Object.keys(
        attributes[matchingAttribute].raw.returns.elements
      );
      if (
        blockUtils.attributeHasTag(
          attributes[matchingAttribute],
          'method:return:unpacked'
        )
      ) {
        valueMap.outputs[returnKeys[0]] = payload.value;
      } else {
        valueMap = mapReturnValues(returnKeys, payload);
      }
      attributes[matchingAttribute] = {
        ...attributes[matchingAttribute],
        calculated: {
          ...attributes[matchingAttribute].calculated,
          ...valueMap,
        },
      };
      blocks[blockName] = { ...state.blocks[blockName], attributes };
    }
    return {
      ...state,
      blocks,
    };
  }
  return state;
};

const MethodReducer = createReducer(
  {},
  {
    [MalcolmUpdateMethodInputType]: updateMethodInput,
    [MalcolmReturn]: handleMethodReturn,
  }
);

export default MethodReducer;
