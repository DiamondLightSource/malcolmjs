class MalcolmSocketContainer {
  constructor(webSocket) {
    this.socket = webSocket;
    this.isConnected = false;
    this.queue = [];
  }
  flush() {
    while (this.queue.length > 0) {
      if (this.isConnected) {
        this.socket.send(this.queue.shift());
      } else {
        return 1;
      }
    }
    return 0;
  }
}

export default MalcolmSocketContainer;
