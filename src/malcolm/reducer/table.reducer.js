/* eslint no-underscore-dangle: 0 */
import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import {
  MalcolmLocalCopy,
  MalcolmTableUpdate,
  MalcolmTableFlag,
} from '../malcolm.types';
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
    attributes[matchingAttributeIndex].raw.value !== undefined
  ) {
    const attribute = { ...attributes[matchingAttributeIndex] };
    attribute.localState = {
      meta: JSON.parse(JSON.stringify(attribute.raw.meta)),
      value: JSON.parse(JSON.stringify(attribute.raw.value)),
      labels: Object.keys(attribute.raw.meta.elements),
      flags: {
        rows: [],
        table: {
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(attribute.raw.timeStamp)),
        },
      },
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
          getDefaultFromType(attribute.raw.meta.elements[label])
        );
      });
      attribute.localState.flags.rows.splice(payload.row, 0, {
        _isChanged: true,
      });
    } else {
      attribute.localState.labels.forEach(label => {
        attribute.localState.value[label][payload.row] = payload.value[label];
      });
      const rowIsDifferent = attribute.localState.labels.some(
        label =>
          `${attribute.localState.value[label][payload.row]}` !==
          `${attribute.raw.value[label][payload.row]}`
      );

      attribute.localState.flags.rows[payload.row] = {
        ...attribute.localState.flags.rows[payload.row],
        _isChanged: rowIsDifferent,
      };
    }
    attribute.localState.flags.table.dirty = attribute.localState.flags.rows.some(
      row => row._dirty || row._isChanged
    );
    attributes[matchingAttributeIndex] = attribute;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

const setTableFlag = (state, payload) => {
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
  if (matchingAttributeIndex >= 0) {
    attribute.localState.flags.rows[payload.row] = {
      ...attribute.localState.flags.rows[payload.row],
      ...payload.flags,
    };
    attributes[matchingAttributeIndex] = attribute;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
    attribute.localState.flags.table[
      payload.flagType
    ] = attribute.localState.flags.rows.some(
      row =>
        row[`_${payload.flagType}`] ||
        (payload.flagType === 'dirty' && row._isChanged)
    );
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
    [MalcolmTableFlag]: setTableFlag,
  }
);

export default TableReducer;
