const io = require('socket.io')();

io.on('connection', function (socket) {
  socket.on('message', message => handleMessage(socket, message));
  socket.on('disconnect', () => handleDisconnect());
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

function handleMessage(socket, message) {
  console.log(message);
  socket.send(message + ' received');
}

function handleDisconnect() {
  console.log('client disconnected');
}