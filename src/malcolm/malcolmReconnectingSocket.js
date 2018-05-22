/* eslint no-underscore-dangle: 0 */

class MalcolmReconnectingSocket {
  constructor(url, reconnectInterval) {
    this.url = url;
    this.interval = reconnectInterval;
    this._socket = {};
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
    socket._socket = new WebSocket(socket.url);
    socket._socket.onopen = socket.onopen;
    socket._socket.onclose = () => {
      socket.onclose();
      socket.reconnect();
    };
    socket._socket.onmessage = socket.onmessage;
    socket._socket.onerror = socket.onerror;
  }
  reconnect() {
    setTimeout(this.connect, this.interval, this);
  }
}

export default MalcolmReconnectingSocket;
