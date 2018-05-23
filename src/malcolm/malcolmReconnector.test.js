import MalcolmReconnector from './malcolmReconnector';

/* eslint no-underscore-dangle: 0 */

jest.useFakeTimers();

class TestSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = () => {};
    this.onerror = () => {};
    this.onopen = () => {};
    this.onclose = () => {};
    this.send = payload => {
      const event = {
        data: payload,
      };
      this.onmessage(event);
    };
  }
}

const socketTimeout = 5000;

describe('malcolm socket reconnector', () => {
  let testReconnect;
  beforeEach(() => {
    testReconnect = new MalcolmReconnector('TEST', socketTimeout, TestSocket);
  });

  it('constructs properly', () => {
    expect(testReconnect.url).toEqual('TEST');
    expect(testReconnect.interval).toEqual(socketTimeout);
    expect(testReconnect.Generator).toEqual(TestSocket);
    expect(testReconnect.isReconnection).toEqual(false);
  });

  it('connects properly', () => {
    const testCallback = () => 'testing callback';
    testReconnect.onopen = testCallback;
    testReconnect.onmessage = testCallback;
    testReconnect.onerror = testCallback;
    testReconnect.connect();
    expect(testReconnect._socket).toBeInstanceOf(TestSocket);
    expect(testReconnect._socket.onopen).toEqual(testCallback);
    expect(testReconnect._socket.onmessage).toEqual(testCallback);
    expect(testReconnect._socket.onerror).toEqual(testCallback);
  });

  it('calls send on passed socket', () => {
    testReconnect.onmessage = jest.fn();
    testReconnect.connect(testReconnect);
    testReconnect.send('test message');
    expect(testReconnect._socket.onmessage.mock.calls.length).toEqual(1);
    expect(testReconnect._socket.onmessage.mock.calls[0][0]).toEqual({
      data: 'test message',
    });
  });

  it('calls reconnect on close', () => {
    testReconnect.url = 'TEST#1';
    testReconnect.connect(testReconnect);
    testReconnect.isConnected = true;
    testReconnect.url = 'TEST#2';
    expect(testReconnect._socket.url).toEqual('TEST#1');
    testReconnect._socket.onclose();
    jest.runTimersToTime(1000);
    expect(testReconnect.isReconnection).toEqual(true);
    expect(testReconnect._socket).toEqual({});
    jest.runTimersToTime(4050);
    expect(testReconnect._socket.url).toEqual('TEST#2');
  });

  it("calls reconnect on close, but doesn't set reconnect flag if never opened", () => {
    testReconnect.url = 'TEST#1';
    testReconnect.connect(testReconnect);
    testReconnect.url = 'TEST#2';
    expect(testReconnect._socket.url).toEqual('TEST#1');
    testReconnect._socket.onclose();
    jest.runTimersToTime(1000);
    expect(testReconnect.isReconnection).toEqual(false);
    expect(testReconnect._socket).toEqual({});
    jest.runTimersToTime(4050);
    expect(testReconnect._socket.url).toEqual('TEST#2');
  });
});
