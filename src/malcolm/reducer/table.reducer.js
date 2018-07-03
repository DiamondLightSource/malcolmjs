import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmLocalCopy, MalcolmTableUpdate } from '../malcolm.types';
import { getDefaultFromType } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

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
    const attribute = { ...attributes[matchingAttributeIndex] };
    attribute.localState = {
      value: JSON.parse(JSON.stringify(attribute.value)),
      labels: Object.keys(attribute.meta.elements),
    };
    attributes[matchingAttributeIndex] = attribute;
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
  const attribute = { ...attributes[matchingAttributeIndex] };
  if (matchingAttributeIndex >= 0 && attribute.localState !== undefined) {
    if (payload.value.insertRow) {
      attribute.localState.labels.forEach(label => {
        attribute.localState.value[label].splice(
          payload.row,
          0,
          getDefaultFromType(attribute.meta.elements[label])
        );
      });
    } else {
      attribute.localState.labels.forEach(label => {
        attribute.localState.value[label][payload.row] = payload.value[label];
      });
    }
    attributes[matchingAttributeIndex] = attribute;
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
