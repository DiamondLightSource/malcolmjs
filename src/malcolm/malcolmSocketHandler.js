const configureMalcolmSocketHandlers = (socket, store) => {
  socket.on('connect', () => {
    console.log('connected to socket');
  });

  socket.on('message', data => {
    // for the moment we are just sending this round the store, but in future we need to do some processing on the result
    store.dispatch({
      type: 'malcolm:received',
      payload: {
        id: data.id,
        typeid: data.typeid,
      },
    });
  });
};

export default configureMalcolmSocketHandlers;
