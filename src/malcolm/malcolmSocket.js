/* eslint no-underscore-dangle: 0 */

class MalcolmSocketContainer {
  constructor(webSocket) {
    this.socket = webSocket;
    this._isConnected = false;
    this.queue = [];
  }
  isConnected() {
    if (Object.prototype.hasOwnProperty.call(this.socket, 'isConnected')) {
      this._isConnected = this.socket.isConnected;
      return this.socket.isConnected;
    }
    return this._isConnected;
  }
  setConnected(state = true) {
    this._isConnected = state;
    if (Object.prototype.hasOwnProperty.call(this.socket, 'isConnected')) {
      this.socket.isConnected = state;
    }
  }
  flush() {
    while (this.queue.length > 0) {
      if (this.isConnected()) {
        this.socket.send(this.queue.shift());
      } else {
        return 1;
      }
    }
    return 0;
  }
}

export default MalcolmSocketContainer;
