/* eslint no-underscore-dangle: 0 */
import MalcolmSocketContainer from './malcolmSocket';

describe('malcolm socket handler', () => {
  let messages = [];
  let socketContainer;
  let socketContainerMK2;
  const socket = {
    onmessage: () => {},
    onerror: () => {},
    onopen: () => {},
    onclose: () => {},
    send: payload => {
      messages.push(payload);
    },
  };

  const betterSocket = {
    onmessage: () => {},
    onerror: () => {},
    onopen: () => {},
    onclose: () => {},
    send: payload => {
      messages.push(payload);
    },
    isConnected: true,
  };

  beforeEach(() => {
    socketContainer = new MalcolmSocketContainer(socket);
    socketContainerMK2 = new MalcolmSocketContainer(betterSocket);
    messages = [];
  });

  it("sets connected if socket doesn't have property", () => {
    socketContainer.setConnected(true);
    expect(socketContainer._isConnected).toEqual(true);
    socketContainer.setConnected(false);
    expect(socketContainer._isConnected).toEqual(false);
  });

  it("gets connected if socket doesn't have property", () => {
    socketContainer._isConnected = 'fish';
    expect(socketContainer.isConnected()).toEqual('fish');
  });

  it('sets connected if socket has property', () => {
    socketContainerMK2.setConnected(true);
    expect(socketContainerMK2.socket.isConnected).toEqual(true);
    socketContainerMK2.setConnected(false);
    expect(socketContainerMK2.socket.isConnected).toEqual(false);
  });

  it('gets connected if socket has property', () => {
    socketContainerMK2.socket.isConnected = 'fish';
    expect(socketContainerMK2.isConnected()).toEqual('fish');
  });

  it('flushes single item if open', () => {
    socketContainer.queue.push('0');
    socketContainer.setConnected(true);
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(0);
    expect(messages).toEqual(['0']);
    expect(socketContainer.queue.length).toEqual(0);
  });

  it('flushes many items if open', () => {
    socketContainer.queue.push('1', '2', '3');
    socketContainer.setConnected(true);
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(0);
    expect(messages.length).toEqual(3);
    expect(socketContainer.queue.length).toEqual(0);
  });

  it("doesn't flush if closed", () => {
    socketContainer.queue.push('1', '2', '3');
    socketContainer.setConnected(false);
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(1);
    expect(messages.length).toEqual(0);
    expect(socketContainer.queue.length).toEqual(3);
  });
});
