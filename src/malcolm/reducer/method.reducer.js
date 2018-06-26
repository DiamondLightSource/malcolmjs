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
    const attributeCopy = attributes[matchingAttribute];
    if (payload.value.isDirty !== undefined) {
      if (!attributeCopy.dirtyInputs) {
        attributeCopy.dirtyInputs = {};
      }
      attributeCopy.dirtyInputs = {
        ...attributeCopy.dirtyInputs,
      };
      attributeCopy.dirtyInputs[payload.name] = payload.value.isDirty;
    } else {
      attributeCopy.inputs = {
        ...attributeCopy.inputs,
      };
      attributeCopy.inputs[payload.name] = payload.value;
    }
    attributes[matchingAttribute] = attributeCopy;
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
    if (
      blockUtils.attributeHasTag(
        attributes[matchingAttribute],
        'method:return:unpacked'
      )
    ) {
      if (returnKeys.length === 1) {
        valueMap[returnKeys[0]] = action.payload.value;
      } else {
        // do Error here
      }
    } else {
      returnKeys.forEach(returnVar => {
        if (action.payload.value[returnVar] !== undefined) {
          valueMap[returnVar] = action.payload.value[returnVar];
        } else {
          // do Error here
        }
      });
    }
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
