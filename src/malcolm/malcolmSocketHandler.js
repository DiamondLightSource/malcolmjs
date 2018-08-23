import {
  BlockMetaHandler,
  RootBlockHandler,
} from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import {
  malcolmResetBlocks,
  malcolmSetDisconnected,
  malcolmSetFlag,
  malcolmHailReturn,
} from './malcolmActionCreators';
import { snackbarState } from '../viewState/viewState.actions';
import { MalcolmAttributeData } from './malcolm.types';
import BlockUtils from './blockUtils';

const handleMessage = (message, dispatch, getState) => {
  const { data, originalRequest } = message;
  switch (data.typeid) {
    case 'malcolm:core/Update:1.0': {
      if (originalRequest.path.join('') === '.blocks') {
        RootBlockHandler(originalRequest, data.value, dispatch, getState());
      }

      break;
    }
    case 'malcolm:core/Delta:1.0': {
      const object = message.attributeDelta;
      const typeid = object.typeid ? object.typeid : '';
      if (typeid === 'malcolm:core/BlockMeta:1.0') {
        BlockMetaHandler(originalRequest, object, dispatch);
      } else if (typeid.slice(0, 8) === 'epics:nt') {
        AttributeHandler.processAttribute(
          originalRequest,
          object,
          getState,
          dispatch
        );
      } else if (typeid === 'malcolm:core/Method:1.0') {
        AttributeHandler.processMethod(originalRequest, object, dispatch);
      } else {
        dispatch({
          type: 'unprocessed_delta',
          payload: object,
        });
        dispatch({
          type: MalcolmAttributeData,
          payload: {
            id: originalRequest.id,
            delta: true,
            unableToProcess: true,
          },
        });
      }
      break;
    }
    case 'malcolm:core/Return:1.0': {
      dispatch(malcolmHailReturn(data, false));
      dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
      break;
    }

    case 'malcolm:core/Error:1.0': {
      if (data.id !== -1) {
        BlockUtils.didBlockLoadFail(originalRequest, dispatch, getState);
        console.log(`------- ${data.message}`);
        dispatch(
          snackbarState(
            true,
            `Error in attribute ${
              originalRequest.path.slice(-1)[0]
            } for block ${originalRequest.path.slice(0, -1)}`
          )
        );
        dispatch(malcolmHailReturn(data, true));
        dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
        break;
      } else {
        dispatch(
          snackbarState(
            true,
            `Error reported by malcolm server: "${data.message}"`
          )
        );
        break;
      }
    }
    default: {
      break;
    }
  }
};

const configureMalcolmSocketHandlers = (store, worker) => {
  worker.addEventListener('message', event => {
    if (event.data === 'socket connected') {
      store.dispatch(malcolmResetBlocks());
      /*
      const malcolmState = store.getState().malcolm;
      malcolmState.messagesInFlight = {};
      handleLocationChange(
        store.getState().router.location.pathname,
        store.getState().malcolm.blocks,
        store.dispatch,
        store.getState
      );
      */
      store.dispatch(snackbarState(true, `Connected to WebSocket`));
    } else if (event.data === 'socket disconnected') {
      store.dispatch(
        snackbarState(
          true,
          `WebSocket disconnected; attempting to reconnect...`
        )
      );
      store.dispatch(malcolmSetDisconnected());
    } else if (
      typeof event.data === 'string' &&
      event.data.startsWith('WebSocket Error: ')
    ) {
      store.dispatch(snackbarState(true, event.data));
    } else {
      handleMessage(event.data, store.dispatch, store.getState);
    }
  });
};

export default configureMalcolmSocketHandlers;
