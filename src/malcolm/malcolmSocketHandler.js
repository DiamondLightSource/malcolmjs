import BlockMetaHandler from './malcolmHandlers/blockMetaHandler';

const buildDefaultPayload = (id, typeid) => ({
  id,
  typeid,
});

const configureMalcolmSocketHandlers = (socket, store) => {
  socket.on('connect', () => {
    console.log('connected to socket');
  });

  socket.on('message', data => {
    // for the moment we are just sending this round the store, but in future we need to do some processing on the result
    console.log(data);
    if (data.typeid === 'malcolm:core/Delta:1.0') {
      const changes = data.changes[0][1];
      if (changes.typeid === 'malcolm:core/BlockMeta:1.0') {
        BlockMetaHandler(
          buildDefaultPayload(data.id, changes.typeid),
          changes,
          store.dispatch
        );
      }
    }
  });
};

export default configureMalcolmSocketHandlers;
