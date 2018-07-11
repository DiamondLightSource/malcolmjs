import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributeFlag,
  MalcolmNavigationPathUpdate,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmMainAttributeUpdate,
  MalcolmReturn,
  MalcolmError,
  MalcolmUpdateBlockPosition,
  MalcolmSelectBlock,
  MalcolmShiftButton,
  MalcolmLocalCopy,
  MalcolmTableUpdate,
  MalcolmTableFlag,
} from './malcolm.types';
import blockUtils from './blockUtils';

export const malcolmGetAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Get:1.0',
    path,
  },
});

export const malcolmSubscribeAction = (path, delta = true) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
    delta,
  },
});

export const malcolmNewBlockAction = (blockName, parent, child) => ({
  type: MalcolmNewBlock,
  payload: {
    blockName,
    parent,
    child,
  },
});

export const malcolmPutAction = (path, value) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Put:1.0',
    path,
    value,
  },
});

export const malcolmPostAction = (path, parameters) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Post:1.0',
    path,
    parameters,
  },
});

export const malcolmSetFlag = (path, flagType, flagState) => ({
  type: MalcolmAttributeFlag,
  payload: {
    path,
    flagType,
    flagState,
  },
});

export const malcolmNavigationPath = blockPaths => ({
  type: MalcolmNavigationPathUpdate,
  payload: {
    blockPaths,
  },
});

export const malcolmCleanBlocks = () => ({
  type: MalcolmCleanBlocks,
});

export const malcolmSetDisconnected = () => ({
  type: MalcolmDisconnected,
});

export const malcolmMainAttribute = attribute => ({
  type: MalcolmMainAttributeUpdate,
  payload: {
    attribute,
  },
});

export const malcolmCopyValue = path => ({
  type: MalcolmLocalCopy,
  payload: {
    path,
  },
});

export const malcolmSetTableFlag = (path, row, flagType, flags) => ({
  type: MalcolmTableFlag,
  payload: {
    path,
    row,
    flagType,
    flags,
  },
});

export const malcolmUpdateTable = (path, value, row) => ({
  type: MalcolmTableUpdate,
  payload: {
    path,
    value,
    row,
  },
});

export const malcolmLayoutUpdatePosition = translation => (
  dispatch,
  getState
) => {
  dispatch({
    type: MalcolmUpdateBlockPosition,
    payload: {
      translation,
    },
  });

  const state = getState().malcolm;
  const blockName = state.parentBlock;
  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    'layout'
  );

  const { selectedBlocks } = state.layoutState;
  if (layoutAttribute) {
    const updateLayoutIndices = selectedBlocks.map(b =>
      layoutAttribute.raw.value.mri.findIndex(val => val === b)
    );
    const updateLayout = {
      name: updateLayoutIndices.map(i => layoutAttribute.raw.value.name[i]),
      visible: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.visible[i]
      ),
      mri: selectedBlocks,
      x: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.x[i] + translation.x
      ),
      y: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.y[i] + translation.y
      ),
    };

    dispatch(malcolmSetFlag([blockName, 'layout'], 'pending', true));
    dispatch(malcolmPutAction([blockName, 'layout', 'value'], updateLayout));
  }
};

export const malcolmSelectBlock = blockName => ({
  type: MalcolmSelectBlock,
  payload: {
    blockName,
  },
});

export const malcolmLayoutShiftIsPressed = shiftIsPressed => ({
  type: MalcolmShiftButton,
  payload: {
    shiftIsPressed,
  },
});

export const malcolmHailReturn = (payload, isErrorState) => ({
  type: isErrorState ? MalcolmError : MalcolmReturn,
  payload,
});

export default {
  malcolmHailReturn,
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmPutAction,
  malcolmSetFlag,
  malcolmNavigationPath,
  malcolmCleanBlocks,
  malcolmSetDisconnected,
  malcolmMainAttribute,
  malcolmLayoutUpdatePosition,
  malcolmSelectBlock,
  malcolmLayoutShiftIsPressed,
  malcolmPostAction,
};
