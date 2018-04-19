const io = require('socket.io')();

io.on('connection', function (socket) {
  socket.on('message', message => handleMessage(message));
  socket.on('disconnect', () => handleDisconnect());
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

function handleMessage(message) {
  console.log(message);
}

function handleDisconnect() {
  console.log('client disconnected');
}