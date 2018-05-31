import {
  BlockMetaHandler,
  RootBlockHandler,
} from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import {
  malcolmSnackbarState,
  malcolmCleanBlocks,
  malcolmSetDisconnected,
  malcolmSetPending,
  malcolmHailReturn,
} from './malcolmActionCreators';
import { MalcolmAttributeData } from './malcolm.types';
import MalcolmReconnector from './malcolmReconnector';
import handleLocationChange from './middleware/malcolmRouting';

const configureMalcolmSocketHandlers = (inputSocketContainer, store) => {
  const socketContainer = inputSocketContainer;

  if (socketContainer.socket instanceof MalcolmReconnector) {
    setTimeout(socketContainer.socket.connect, 0, socketContainer.socket);
  }

  socketContainer.socket.onerror = error => {
    const errorString = JSON.stringify(error);
    store.dispatch(
      malcolmSnackbarState(true, `WebSocket Error: ${errorString}`)
    );
    console.log(`WebSocket Error: ${errorString}`);
  };

  socketContainer.socket.onopen = () => {
    console.log('connected to socket');
    store.dispatch(malcolmCleanBlocks());
    if (socketContainer.socket.isReconnection) {
      const malcolmState = store.getState().malcolm;
      malcolmState.messagesInFlight = [];
      handleLocationChange(
        store.getState().router.location.pathname,
        store.getState().malcolm.blocks,
        store.dispatch
      );
    }
    store.dispatch(malcolmSnackbarState(true, `Connected to WebSocket`));
    socketContainer.setConnected(true);
    socketContainer.flush();
  };

  socketContainer.socket.onclose = () => {
    console.log('socket disconnected');
    if (socketContainer.socket instanceof MalcolmReconnector) {
      store.dispatch(
        malcolmSnackbarState(
          true,
          `WebSocket disconnected; attempting to reconnect...`
        )
      );
    } else {
      store.dispatch(malcolmSnackbarState(true, `WebSocket disconnected`));
    }
    store.dispatch(malcolmSetDisconnected());
  };

  socketContainer.socket.onmessage = event => {
    const data = JSON.parse(event.data);
    switch (data.typeid) {
      case 'malcolm:core/Update:1.0': {
        const originalRequest = store
          .getState()
          .malcolm.messagesInFlight.find(m => m.id === data.id);

        if (originalRequest.path.join('') === '.blocks') {
          RootBlockHandler(originalRequest, data.value, store.dispatch);
        }

        break;
      }
      case 'malcolm:core/Delta:1.0': {
        const { changes } = data;
        const originalRequest = store
          .getState()
          .malcolm.messagesInFlight.find(m => m.id === data.id);
        const attribute = AttributeHandler.processDeltaMessage(
          changes,
          originalRequest,
          store
        );

        switch (attribute.typeid) {
          case 'malcolm:core/BlockMeta:1.0':
            BlockMetaHandler(originalRequest, attribute, store.dispatch);
            break;

          case 'epics:nt/NTScalar:1.0':
            AttributeHandler.processScalarAttribute(
              originalRequest,
              attribute,
              store.dispatch
            );
            break;

          case 'epics:nt/NTTable:1.0':
            AttributeHandler.processTableAttribute(
              originalRequest,
              attribute,
              store.getState().malcolm,
              store.dispatch
            );
            break;

          default:
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
            break;
        }
        break;
      }
      case 'malcolm:core/Return:1.0': {
        const originalRequest = store
          .getState()
          .malcolm.messagesInFlight.find(m => m.id === data.id);
        store.dispatch(malcolmSetPending(originalRequest.path, false));
        store.dispatch(malcolmHailReturn(data.id));
        break;
      }

      case 'malcolm:core/Error:1.0': {
        if (data.id !== -1) {
          const originalRequest = store
            .getState()
            .malcolm.messagesInFlight.find(m => m.id === data.id);

          store.dispatch(
            malcolmSnackbarState(
              true,
              `Error in attribute ${
                originalRequest.path.slice(-1)[0]
              } for block ${originalRequest.path.slice(0, -1)}`
            )
          );
          store.dispatch(malcolmHailReturn(data.id));
          break;
        } else {
          store.dispatch(
            malcolmSnackbarState(
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
