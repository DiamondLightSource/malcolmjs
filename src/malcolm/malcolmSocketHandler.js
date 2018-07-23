import {
  BlockMetaHandler,
  RootBlockHandler,
} from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import {
  malcolmCleanBlocks,
  malcolmSetDisconnected,
  malcolmSetFlag,
  malcolmHailReturn,
} from './malcolmActionCreators';
import { snackbarState } from '../viewState/viewState.actions';
import { MalcolmAttributeData } from './malcolm.types';
import BlockUtils from './blockUtils';
import MalcolmReconnector from './malcolmReconnector';
import handleLocationChange from './middleware/malcolmRouting';

let messages = [];

const configureMalcolmSocketHandlers = (inputSocketContainer, store) => {
  const socketContainer = inputSocketContainer;

  socketContainer.socket.onerror = error => {
    const errorString = JSON.stringify(error);
    store.dispatch(snackbarState(true, `WebSocket Error: ${errorString}`));
    console.log(`WebSocket Error: ${errorString}`);
  };

  socketContainer.socket.onopen = () => {
    console.log('connected to socket');
    store.dispatch(malcolmCleanBlocks());
    if (socketContainer.socket.isReconnection) {
      const malcolmState = store.getState().malcolm;
      malcolmState.messagesInFlight = {};
      handleLocationChange(
        store.getState().router.location.pathname,
        store.getState().malcolm.blocks,
        store.dispatch,
        store.getState
      );
    }
    store.dispatch(snackbarState(true, `Connected to WebSocket`));
    socketContainer.setConnected(true);
    socketContainer.flush();
  };

  socketContainer.socket.onclose = () => {
    console.log('socket disconnected');
    if (socketContainer.socket instanceof MalcolmReconnector) {
      store.dispatch(
        snackbarState(
          true,
          `WebSocket disconnected; attempting to reconnect...`
        )
      );
    } else {
      store.dispatch(snackbarState(true, `WebSocket disconnected`));
    }
    store.dispatch(malcolmSetDisconnected());
  };

  setInterval(() => {
    const messagesToProcess = [...messages];
    messages = [];

    messagesToProcess.forEach(msg => {
      store.dispatch((dispatch, getState) => {
        const data = JSON.parse(msg);
        switch (data.typeid) {
          case 'malcolm:core/Update:1.0': {
            const originalRequest = getState().malcolm.messagesInFlight[
              data.id
            ];

            if (originalRequest.path.join('') === '.blocks') {
              RootBlockHandler(
                originalRequest,
                data.value,
                dispatch,
                getState()
              );
            }

            break;
          }
          case 'malcolm:core/Delta:1.0': {
            const { changes } = data;
            const originalRequest = getState().malcolm.messagesInFlight[
              data.id
            ];
            const attribute = AttributeHandler.processDeltaMessage(
              changes,
              originalRequest,
              getState
            );
            const typeid = attribute.typeid ? attribute.typeid : '';
            if (typeid === 'malcolm:core/BlockMeta:1.0') {
              BlockMetaHandler(originalRequest, attribute, dispatch);
            } else if (typeid.slice(0, 8) === 'epics:nt') {
              AttributeHandler.processAttribute(
                originalRequest,
                attribute,
                getState,
                dispatch
              );
            } else if (typeid === 'malcolm:core/Method:1.0') {
              AttributeHandler.processMethod(
                originalRequest,
                attribute,
                dispatch
              );
            } else {
              dispatch({
                type: 'unprocessed_delta',
                payload: attribute,
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
            const originalRequest = getState().malcolm.messagesInFlight[
              data.id
            ];
            dispatch(malcolmHailReturn(data, false));
            dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
            break;
          }

          case 'malcolm:core/Error:1.0': {
            console.log(data);
            if (data.id !== -1) {
              const originalRequest = getState().malcolm.messagesInFlight[
                data.id
              ];
              BlockUtils.didBlockLoadFail(originalRequest, dispatch, getState);

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
      });
    });
  }, 90);

  socketContainer.socket.onmessage = event => {
    messages.push(event.data);
  };
};

export default configureMalcolmSocketHandlers;
