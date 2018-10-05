/* eslint no-underscore-dangle: 0 */

// Takes a webSocket-like object and wraps it with a queue and some simple methods

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
  setConnected(state) {
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
  purge() {
    this.queue = [];
  }
}

export default MalcolmSocketContainer;
