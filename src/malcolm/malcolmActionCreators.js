import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributePending,
  MalcolmSnackbar,
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

export const malcolmNewParentBlockAction = blockName => ({
  type: MalcolmNewBlock,
  payload: {
    blockName,
    parent: true,
    child: false,
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

export default {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewParentBlockAction,
  malcolmPutAction,
  malcolmSetPending,
  malcolmSnackbarState,
};
