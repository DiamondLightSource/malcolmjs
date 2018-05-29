/* eslint no-underscore-dangle: 0 */
// Takes a constructor for a webSocket-like object and adds some simple reconnection behaviour,
// whilst exposing the same methods/attributes as a standard webSocket to the rest of malcolmJS

class MalcolmReconnector {
  constructor(url, reconnectInterval, connectionGenerator) {
    this.url = url;
    this.interval = reconnectInterval;
    this.Generator = connectionGenerator;
    this._socket = {};
    this.isConnected = false;
    this.isReconnection = false;
    this.onmessage = () => {};
    this.onopen = () => {};
    this.onclose = () => {};
    this.onerror = () => {};
  }
  send(data) {
    this._socket.send(data);
  }
  connect(inputSocket = this) {
    const socket = inputSocket;
    socket._socket = new socket.Generator(socket.url);
    socket._socket.onopen = socket.onopen;
    socket._socket.onclose = () => {
      socket.onclose();
      socket.reconnect();
    };
    socket._socket.onmessage = socket.onmessage;
    socket._socket.onerror = socket.onerror;
  }
  reconnect() {
    if (this.isConnected) {
      this.isReconnection = true;
    }
    this._socket = {};
    setTimeout(this.connect, this.interval, this);
  }
}

export default MalcolmReconnector;
