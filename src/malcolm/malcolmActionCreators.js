import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributePending,
  MalcolmSnackbar,
  MalcolmNavigationPathUpdate,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmMainAttributeUpdate,
  MalcolmReturn,
  MalcolmError,
  MalcolmUpdateBlockPosition,
  MalcolmSelectBlock,
  MalcolmShiftButton,
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

export const malcolmSetPending = (path, pending) => ({
  type: MalcolmAttributePending,
  payload: {
    path,
    pending,
  },
});

export const malcolmSnackbarState = (open, message) => ({
  type: MalcolmSnackbar,
  snackbar: {
    open,
    message,
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
      layoutAttribute.value.mri.findIndex(val => val === b)
    );
    const updateLayout = {
      name: updateLayoutIndices.map(i => layoutAttribute.value.name[i]),
      visible: updateLayoutIndices.map(i => layoutAttribute.value.visible[i]),
      mri: selectedBlocks,
      x: updateLayoutIndices.map(
        i => layoutAttribute.value.x[i] + translation.x
      ),
      y: updateLayoutIndices.map(
        i => layoutAttribute.value.y[i] + translation.y
      ),
    };

    dispatch(malcolmSetPending([blockName, 'layout'], true));
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

export const malcolmHailReturn = (id, isErrorState, error = undefined) => ({
  type: isErrorState ? MalcolmError : MalcolmReturn,
  payload: {
    id,
    error,
  },
});

export default {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmPutAction,
  malcolmSetPending,
  malcolmSnackbarState,
  malcolmNavigationPath,
  malcolmCleanBlocks,
  malcolmSetDisconnected,
  malcolmMainAttribute,
  malcolmLayoutUpdatePosition,
  malcolmSelectBlock,
  malcolmLayoutShiftIsPressed,
};
