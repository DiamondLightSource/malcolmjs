class MalcolmSocketContainer {
  constructor(address, port) {
    this.socket = new WebSocket(`ws://${address}:${port}/ws`);
    this.isConnected = false;
    this.queue = [];
  }
  flush() {
    while (this.queue.length > 0) {
      if (this.isConnected) {
        this.socket.send(this.queue[0]);
        this.queue.shift();
      } else {
        return 1;
      }
    }
    return 0;
  }
}

export default MalcolmSocketContainer;
