import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType, MalcolmReturn } from '../malcolm.types';

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

export const handleMethodReturn = (state, payload) => {
  const matchingMessage = state.messagesInFlight.find(m => m.id === payload.id);
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
          valueMap[returnKeys[0]] = payload.value;
        }
      } else {
        returnKeys.forEach(returnVar => {
          if (payload.value[returnVar] !== undefined) {
            valueMap[returnVar] = payload.value[returnVar];
          } else {
            console.log(
              `MethodError: expected value ${returnVar} missing from return`
            );
            attributes[matchingAttribute].errorState = true;
            attributes[
              matchingAttribute
            ].errorMessage = `MethodError: expected value ${returnVar} missing from return`;
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
