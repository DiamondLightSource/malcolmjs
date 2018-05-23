import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributePending,
  MalcolmSnackbar,
  MalcolmNavigationPathUpdate,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
} from './malcolm.types';

export const malcolmGetAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Get:1.0',
    path,
  },
});

export const malcolmSubscribeAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
    delta: true,
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

export const malcolmSetPending = path => ({
  type: MalcolmAttributePending,
  payload: {
    path,
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
};
