import MalcolmSocketContainer from './malcolmSocket';

describe('malcolm socket handler', () => {
  let messages = [];
  const socket = {
    onmessage: () => {},
    onerror: () => {},
    onopen: () => {},
    onclose: () => {},
    send: payload => {
      messages.push(payload);
    },
  };

  const socketContainer = new MalcolmSocketContainer(socket);

  beforeEach(() => {
    messages = [];
  });

  it('flushes single item if open', () => {
    socketContainer.queue.push('0');
    socketContainer.isConnected = true;
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(0);
    expect(messages).toEqual(['0']);
    expect(socketContainer.queue.length).toEqual(0);
  });

  it('flushes many items if open', () => {
    socketContainer.queue.push('1', '2', '3');
    socketContainer.isConnected = true;
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(0);
    expect(messages.length).toEqual(3);
    expect(socketContainer.queue.length).toEqual(0);
  });

  it("doesn't flush if closed", () => {
    socketContainer.queue.push('1', '2', '3');
    socketContainer.isConnected = false;
    const flushStatus = socketContainer.flush();
    expect(flushStatus).toEqual(1);
    expect(messages.length).toEqual(0);
    expect(socketContainer.queue.length).toEqual(3);
  });
});
