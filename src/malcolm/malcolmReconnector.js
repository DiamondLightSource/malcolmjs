/* eslint no-underscore-dangle: 0 */

class MalcolmReconnector {
  constructor(url, reconnectInterval, connectionGenerator) {
    this.url = url;
    this.interval = reconnectInterval;
    this.Generator = connectionGenerator;
    this._socket = {};
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
    this.isReconnection = true;
    setTimeout(this.connect, this.interval, this);
  }
}

export default MalcolmReconnector;
