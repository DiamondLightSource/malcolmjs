import {
  BlockMetaHandler,
  RootBlockHandler,
} from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import {
  malcolmSnackbarState,
  malcolmCleanBlocks,
  malcolmSetDisconnected,
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
    let path = store.getState().router.location.pathname;
    path = `/gui/${path.split(',').join('/')}`;
    store.dispatch(malcolmCleanBlocks());
    if (socketContainer.socket.isReconnection) {
      const malcolmState = store.getState().malcolm;
      malcolmState.messagesInFlight = [];
      handleLocationChange(path, store.dispatch);
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

        // Messy Bits
        const attributePath = originalRequest.path;
        // TODO: handle attribute path properly for more general cases
        const blockName = attributePath[0];
        const attributeName = attributePath[1];
        let attribute;

        // Pull attribute from store (if exists)
        if (
          Object.prototype.hasOwnProperty.call(
            store.getState().malcolm.blocks,
            blockName
          ) &&
          Object.prototype.hasOwnProperty.call(
            store.getState().malcolm.blocks[blockName],
            'attributes'
          )
        ) {
          const attributes = [
            ...store.getState().malcolm.blocks[blockName].attributes,
          ];
          const matchingAttribute = attributes.findIndex(
            a => a.name === attributeName
          );
          if (matchingAttribute >= 0) {
            attribute = store.getState().malcolm.blocks[blockName].attributes[
              matchingAttribute
            ];
          }
        }

        // apply changes in delta
        changes.forEach(change => {
          const path = change[0];
          if (path.length !== 0) {
            let update = attribute;
            path.slice(0, -1).forEach(element => {
              update = Object.prototype.hasOwnProperty.call(update, element)
                ? update[element]
                : {};
            });
            if (change.length === 1) {
              delete update[path.slice(-1)[0]];
            } else {
              // Seems to be a false positive for this rule?
              // eslint-disable-next-line prefer-destructuring
              update[path.slice(-1)[0]] = change[1];
            }
          } else if (change.length === 2) {
            attribute = { ...change[1] };
          }
        });

        // Mess done

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

        const attributePath = originalRequest.path;
        const blockName = attributePath[0];
        const attributeName = attributePath[1];
        let attribute;

        // Pull attribute from store (if exists)
        if (
          Object.prototype.hasOwnProperty.call(
            store.getState().malcolm.blocks,
            blockName
          ) &&
          Object.prototype.hasOwnProperty.call(
            store.getState().malcolm.blocks[blockName],
            'attributes'
          )
        ) {
          const attributes = [
            ...store.getState().malcolm.blocks[blockName].attributes,
          ];
          const matchingAttribute = attributes.findIndex(
            a => a.name === attributeName
          );
          if (matchingAttribute >= 0) {
            attribute = store.getState().malcolm.blocks[blockName].attributes[
              matchingAttribute
            ];
            if (Object.prototype.hasOwnProperty.call(attribute, 'pending')) {
              attribute.pending = false;
            }
          }
        }
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
