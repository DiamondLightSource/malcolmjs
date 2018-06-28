import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmLocalCopy, MalcolmTableUpdate } from '../malcolm.types';

export const copyAttributeValue = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  const { attributes } = state.blocks[blockName];
  if (
    matchingAttributeIndex >= 0 &&
    attributes[matchingAttributeIndex].value !== undefined
  ) {
    attributes[matchingAttributeIndex].localState = {
      value: attributes[matchingAttributeIndex].value,
      labels: Object.keys(attributes[matchingAttributeIndex].meta.elements),
    };
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const updateTableLocal = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  const { attributes } = state.blocks[blockName];
  const valueCopy = attributes[matchingAttributeIndex].localState;
  if (matchingAttributeIndex >= 0 && valueCopy !== undefined) {
    valueCopy.labels.forEach(label => {
      valueCopy.value[label][payload.row] = payload.value[label];
    });
    attributes[matchingAttributeIndex].localState = valueCopy;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

const TableReducer = createReducer(
  {},
  {
    [MalcolmLocalCopy]: copyAttributeValue,
    [MalcolmTableUpdate]: updateTableLocal,
  }
);

export default TableReducer;
