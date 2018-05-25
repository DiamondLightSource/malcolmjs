/* eslint no-underscore-dangle: 0 */
import MalcolmSocketContainer from './malcolmSocket';

describe('malcolm socket handler', () => {
  let messages = [];
  let socketContainerDummyVanilla;
  let socketContainerDummyReconnector;
  const dummyVanillaSocket = {
    onmessage: () => {},
    onerror: () => {},
    onopen: () => {},
    onclose: () => {},
    send: payload => {
      messages.push(payload);
    },
  };

  const dummyReconnectorSocket = {
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
    socketContainerDummyVanilla = new MalcolmSocketContainer(
      dummyVanillaSocket
    );
    socketContainerDummyReconnector = new MalcolmSocketContainer(
      dummyReconnectorSocket
    );
    messages = [];
  });

  it("sets connected if socket doesn't have isConnected property", () => {
    socketContainerDummyVanilla.setConnected(true);
    expect(socketContainerDummyVanilla._isConnected).toEqual(true);
    socketContainerDummyVanilla.setConnected(false);
    expect(socketContainerDummyVanilla._isConnected).toEqual(false);
  });

  it("gets connected if socket doesn't have isConnected property", () => {
    socketContainerDummyVanilla._isConnected = 'fish';
    expect(socketContainerDummyVanilla.isConnected()).toEqual('fish');
  });

  it('sets connected if socket has isConnected property', () => {
    socketContainerDummyReconnector.setConnected(true);
    expect(socketContainerDummyReconnector.socket.isConnected).toEqual(true);
    socketContainerDummyReconnector.setConnected(false);
    expect(socketContainerDummyReconnector.socket.isConnected).toEqual(false);
  });

  it('gets connected if socket has isConnected property', () => {
    socketContainerDummyReconnector.socket.isConnected = 'fish';
    expect(socketContainerDummyReconnector.isConnected()).toEqual('fish');
  });

  it('flushes single item if open', () => {
    socketContainerDummyVanilla.queue.push('0');
    socketContainerDummyVanilla.setConnected(true);
    const flushStatus = socketContainerDummyVanilla.flush();
    expect(flushStatus).toEqual(0);
    expect(messages).toEqual(['0']);
    expect(socketContainerDummyVanilla.queue.length).toEqual(0);
  });

  it('flushes many items if open', () => {
    socketContainerDummyVanilla.queue.push('1', '2', '3');
    socketContainerDummyVanilla.setConnected(true);
    const flushStatus = socketContainerDummyVanilla.flush();
    expect(flushStatus).toEqual(0);
    expect(messages.length).toEqual(3);
    expect(socketContainerDummyVanilla.queue.length).toEqual(0);
  });

  it("doesn't flush if closed", () => {
    socketContainerDummyVanilla.queue.push('1', '2', '3');
    socketContainerDummyVanilla.setConnected(false);
    const flushStatus = socketContainerDummyVanilla.flush();
    expect(flushStatus).toEqual(1);
    expect(messages.length).toEqual(0);
    expect(socketContainerDummyVanilla.queue.length).toEqual(3);
  });
});
