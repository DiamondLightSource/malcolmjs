import BlockMetaHandler from './malcolmHandlers/blockMetaHandler';
import AttributeHandler from './malcolmHandlers/attributeHandler';
import { MalcolmAttributeData } from './malcolm.types';

const configureMalcolmSocketHandlers = (inputSocketContainer, store) => {
  const socketContainer = inputSocketContainer;

  socketContainer.socket.onerror = error => {
    const errorString = JSON.stringify(error);
    console.log(`WebSocket Error: ${errorString}`);
  };

  socketContainer.socket.onopen = () => {
    console.log('connected to socket');
    socketContainer.isConnected = true;
    socketContainer.flush();
  };

  socketContainer.socket.onclose = () => {
    console.log('socket disconnected');
  };

  socketContainer.socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.typeid === 'malcolm:core/Delta:1.0') {
      const changes = data.changes[0][1];
      const originalRequest = store
        .getState()
        .malcolm.messagesInFlight.find(m => m.id === data.id);

      // Messy Bits
      const { path } = originalRequest;
      const blockName = path[0];
      const attributeName = path[1];
      let attribute;

      if (
        Object.prototype.hasOwnProperty.call(
          store.getState().malcolm.blocks,
          blockName
        )
      ) {
        if (
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
      }

      let delta = {};
      if (data.changes[0][0].length !== 0) {
        delta[data.changes[0][0]] = changes;
      } else {
        delta = { ...changes };
      }
      attribute = {
        ...attribute,
        ...delta,
      };
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
    }
  };
};

export default configureMalcolmSocketHandlers;
