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
        store.dispatch
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

  socketContainer.socket.onmessage = event => {
    const data = JSON.parse(event.data);
    switch (data.typeid) {
      case 'malcolm:core/Update:1.0': {
        const originalRequest = store.getState().malcolm.messagesInFlight[
          data.id
        ];

        if (originalRequest.path.join('') === '.blocks') {
          RootBlockHandler(originalRequest, data.value, store.dispatch);
        }

        break;
      }
      case 'malcolm:core/Delta:1.0': {
        const { changes } = data;
        const originalRequest = store.getState().malcolm.messagesInFlight[
          data.id
        ];
        const attribute = AttributeHandler.processDeltaMessage(
          changes,
          originalRequest,
          store
        );

        if (attribute.typeid === 'malcolm:core/BlockMeta:1.0') {
          BlockMetaHandler(originalRequest, attribute, store.dispatch);
        } else if (attribute.typeid.slice(0, 8) === 'epics:nt') {
          AttributeHandler.processAttribute(
            originalRequest,
            attribute,
            store.getState().malcolm,
            store.dispatch
          );
        } else if (attribute.typeid === 'malcolm:core/Method:1.0') {
          AttributeHandler.processMethod(
            originalRequest,
            attribute,
            store.dispatch
          );
        } else {
          store.dispatch({
            type: 'unprocessed_delta',
            payload: attribute,
          });
          store.dispatch({
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
        const originalRequest = store.getState().malcolm.messagesInFlight[
          data.id
        ];
        store.dispatch(malcolmHailReturn(data, false));
        store.dispatch(malcolmSetFlag(originalRequest.path, 'pending', false));
        break;
      }

      case 'malcolm:core/Error:1.0': {
        console.log(data);
        if (data.id !== -1) {
          const originalRequest = store.getState().malcolm.messagesInFlight[
            data.id
          ];
          BlockUtils.didBlockLoadFail(originalRequest, store);

          store.dispatch(
            snackbarState(
              true,
              `Error in attribute ${
                originalRequest.path.slice(-1)[0]
              } for block ${originalRequest.path.slice(0, -1)}`
            )
          );
          store.dispatch(malcolmHailReturn(data, true));
          store.dispatch(
            malcolmSetFlag(originalRequest.path, 'pending', false)
          );
          break;
        } else {
          store.dispatch(
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
};

export default configureMalcolmSocketHandlers;
