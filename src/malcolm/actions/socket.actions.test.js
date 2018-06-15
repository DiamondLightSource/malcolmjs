import mockAxios from 'axios';
import { registerSocketAndConnect, configureSocket } from './socket.actions';

describe('socket.actions', () => {
  const socketContainer = {};
  const url = 'test';

  it('registerSocketAndConnect sends a socket connect message', () => {
    const action = registerSocketAndConnect(socketContainer, url);

    expect(action.type).toEqual('malcolm:socketconnect');
    expect(action.payload.socketContainer).toBe(socketContainer);
    expect(action.payload.socketUrl).toBe(url);
  });

  it('configureSocket gets the settings and dispatches updates', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { malcolmSocket: url, version: '1.2.3' },
      })
    );

    const asyncAction = configureSocket(socketContainer);

    const actions = [];
    const dispatch = action => actions.push(action);

    await asyncAction(dispatch);

    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual('UPDATE_VERSION');
    expect(actions[0].payload.version).toEqual('1.2.3');

    expect(actions[1].type).toEqual('malcolm:socketconnect');
    expect(actions[1].payload.socketContainer).toBe(socketContainer);
    expect(actions[1].payload.socketUrl).toEqual(url);
  });

  it('configureSocket does not dispatch socket update if no url', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { version: '1.2.3' },
      })
    );

    const asyncAction = configureSocket(socketContainer);

    const actions = [];
    const dispatch = action => actions.push(action);

    await asyncAction(dispatch);

    expect(actions.some(a => a.type === 'malcolm:socketconnect')).toBeFalsy();
  });
});
