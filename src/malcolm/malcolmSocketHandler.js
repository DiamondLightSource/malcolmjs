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

      switch (changes.typeid) {
        case 'malcolm:core/BlockMeta:1.0':
          BlockMetaHandler(originalRequest, changes, store.dispatch);
          break;

        case 'epics:nt/NTScalar:1.0':
          AttributeHandler.processScalarAttribute(
            originalRequest,
            changes,
            store.dispatch
          );
          break;

        default:
          store.dispatch({
            type: 'unprocessed_delta',
            payload: changes,
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
