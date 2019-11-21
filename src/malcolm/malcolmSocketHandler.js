import {
  BlockMetaHandler,
  RootBlockHandler,
  rootBlockSubPath,
} from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import {
  malcolmResetBlocks,
  malcolmSetDisconnected,
  malcolmSetFlag,
  malcolmHailReturn,
  malcolmProcessMethodReturn,
  malcolmSubscribeAction,
} from './malcolmActionCreators';
import { snackbarState } from '../viewState/viewState.actions';
import { MalcolmAttributeData } from './malcolm.types';
import BlockUtils from './blockUtils';

const isAttributeDelta = msg =>
  msg.data.typeid === 'malcolm:core/Delta:1.0' &&
  msg.attributeDelta.typeid &&
  msg.attributeDelta.typeid.slice(0, 8) === 'epics:nt';

const handleMessages = (messages, dispatch, getState) => {
  const attributeDeltas = messages.filter(msg => isAttributeDelta(msg));
  const otherMessages = messages.filter(msg => !isAttributeDelta(msg));
  const { messagesInFlight } = getState().malcolm;
  messages.forEach(message => {
    const { originalRequest } = message;
    if (
      originalRequest &&
      originalRequest.id &&
      messagesInFlight[originalRequest.id].callback
    ) {
      messagesInFlight[originalRequest.id].callback(message);
    }
  });
  otherMessages.forEach(message => {
    const { data, originalRequest } = message;
    switch (data.typeid) {
      case 'malcolm:core/Update:1.0': {
        if (
          JSON.stringify(originalRequest.path) ===
          JSON.stringify(rootBlockSubPath)
        ) {
          RootBlockHandler(originalRequest, data.value, dispatch, getState());
        }
        // We don't expect non-delta subscriptions for anything else
        break;
      }
      case 'malcolm:core/Delta:1.0': {
        const object = message.attributeDelta;
        const typeid = object.typeid ? object.typeid : '';
        if (typeid === 'malcolm:core/BlockMeta:1.0') {
          BlockMetaHandler(originalRequest, object, dispatch, messagesInFlight);
        } else if (typeid.slice(0, 8) === 'epics:nt') {
          // multiple attribute updates are now handled separately.
        } else if (typeid === 'malcolm:core/Method:1.1') {
          const writableStateChange =
            data.changes.length === 1 &&
            data.changes[0][0][0] === 'meta' &&
            data.changes[0][0][1] === 'writeable';
          AttributeHandler.processMethod(
            originalRequest,
            object,
            dispatch,
            writableStateChange
          );
        } else {
          dispatch({
            type: 'unprocessed_delta',
            payload: object,
          });
          dispatch({
            type: MalcolmAttributeData,
            payload: {
              id: originalRequest && originalRequest.id,
              delta: true,
              unableToProcess: true,
              raw: {},
            },
          });
          dispatch(
            snackbarState(
              true,
              `Got object of unknown typeid "${object.typeid}"`
            )
          );
        }
        break;
      }
      case 'malcolm:core/Return:1.0': {
        switch (messagesInFlight[data.id].typeid) {
          case 'malcolm:core/Get:1.0':
            if (data.value && data.value.typeid) {
              // Handle return from a Get
              if (data.value.typeid === 'malcolm:core/BlockMeta:1.0') {
                BlockMetaHandler(
                  originalRequest,
                  data.value,
                  dispatch,
                  messagesInFlight,
                  false,
                  true
                );
              } else if (data.value.typeid.slice(0, 8) === 'epics:nt') {
                AttributeHandler.processAttribute(originalRequest, data.value);
              }
            }
            break;
          case 'malcolm:core/Post:1.0':
            dispatch(malcolmProcessMethodReturn(data));
            break;
          default:
            break;
        }
        dispatch(malcolmHailReturn(data, false));
        dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
        break;
      }

      case 'malcolm:core/Error:1.0': {
        if (data.id !== -1) {
          switch (messagesInFlight[data.id].typeid) {
            case 'malcolm:core/Get:1.0':
            case 'malcolm:core/Subscribe:1.0': {
              BlockUtils.didBlockLoadFail(originalRequest, dispatch, getState);
              const loadFailMessage =
                originalRequest.path.length % 2 === 0 &&
                originalRequest.path.slice(-1)[0] === 'meta'
                  ? `Failed to load block ${originalRequest.path.slice(
                      0,
                      -1
                    )} (Error in attribute meta)`
                  : `Error loading attribute ${
                      originalRequest.path.slice(-1)[0]
                    } for block ${originalRequest.path.slice(0, -1)}`;
              dispatch(snackbarState(true, loadFailMessage));
              dispatch(malcolmHailReturn(data, true));
              dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
              break;
            }
            case 'malcolm:core/Put:1.0': {
              dispatch(
                snackbarState(
                  true,
                  `Failed to write to attribute ${originalRequest.path.slice(
                    -(1)[[0]]
                  )} on block ${originalRequest.path.slice(0, -1)} (${
                    data.message
                  })`
                )
              );
              dispatch(malcolmHailReturn(data, true));
              dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
              break;
            }
            case 'malcolm:core/Post:1.0': {
              dispatch(
                snackbarState(
                  true,
                  `Server failed to run method ${
                    originalRequest.path.slice(-1)[0]
                  } (${data.message})`
                )
              );
              dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
              dispatch(malcolmProcessMethodReturn({ ...data }));
              dispatch(malcolmHailReturn(data, true));
              break;
            }
            default:
              dispatch(
                snackbarState(
                  true,
                  `Error in message ${data.id} (${data.message})`
                )
              );
              dispatch(malcolmHailReturn(data, true));
          }
        } else {
          dispatch(
            snackbarState(
              true,
              `Error reported by malcolm server: "${data.message}"`
            )
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  });

  if (attributeDeltas.length > 0) {
    AttributeHandler.processAttributes(attributeDeltas, getState, dispatch);
  }
};

const configureMalcolmSocketHandlers = (store, worker) => {
  worker.addEventListener('message', event => {
    if (event.data === 'socket connected') {
      store.dispatch(malcolmResetBlocks());
      store.dispatch(snackbarState(true, `Connected to WebSocket`));
    } else if (event.data === 'socket disconnected') {
      store.dispatch(
        snackbarState(
          true,
          `WebSocket disconnected; attempting to reconnect...`
        )
      );
      store.dispatch(malcolmSetDisconnected());
      store.dispatch(malcolmSubscribeAction(rootBlockSubPath, false));
    } else if (
      typeof event.data === 'string' &&
      event.data.startsWith('WebSocket Error: ')
    ) {
      store.dispatch(snackbarState(true, event.data));
    } else {
      const messages = JSON.parse(event.data);
      handleMessages(messages, store.dispatch, store.getState);
    }
  });
};

export default configureMalcolmSocketHandlers;
