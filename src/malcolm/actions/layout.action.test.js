import { selectPort } from './layout.action';
import {
  MalcolmSelectPortType,
  MalcolmAttributeFlag,
  MalcolmSend,
} from '../malcolm.types';

describe('layout actions', () => {
  let actions = [];
  let state = {};
  let dispatch;
  const getState = () => state;

  beforeEach(() => {
    actions = [];
    dispatch = action => actions.push(action);

    state = {
      malcolm: {
        layoutState: {
          startPortForLink: undefined,
          endPortForLink: undefined,
        },
        layout: {
          blocks: [
            {
              mri: 'PANDA',
              ports: [
                {
                  label: 'start',
                  input: false,
                  tag: 'START',
                },
                {
                  label: 'enable',
                  input: true,
                  tag: 'ZERO',
                  value: 'ZERO',
                },
              ],
            },
          ],
        },
      },
    };
  });

  it('selectPort dispatches a select port notification', () => {
    const action = selectPort('PANDA-enable', true);
    action(dispatch, getState);

    expect(actions.length).toBeGreaterThanOrEqual(1);
    expect(actions[0].type).toEqual(MalcolmSelectPortType);
    expect(actions[0].payload.portId).toEqual('PANDA-enable');
    expect(actions[0].payload.start).toBeTruthy();
  });

  const runPortTest = (startPort, endPort) => {
    state.malcolm.layoutState.startPortForLink = startPort;
    // simulate the reducer picking up the port selection first
    dispatch = action => {
      actions.push(action);
      if (action.type === MalcolmSelectPortType) {
        state.malcolm.layoutState.endPortForLink = action.payload.portId;
      }
    };

    const action = selectPort(endPort, false);
    action(dispatch, getState);

    expect(actions).toHaveLength(3);
    expect(actions[1].type).toEqual(MalcolmAttributeFlag);
    expect(actions[1].payload.path).toEqual(['PANDA', 'enable', 'value']);
    expect(actions[1].payload.flagType).toEqual('pending');
    expect(actions[1].payload.flagState).toBeTruthy();

    expect(actions[2].type).toEqual(MalcolmSend);
    expect(actions[2].payload.path).toEqual(['PANDA', 'enable', 'value']);
    expect(actions[2].payload.value).toEqual('START');
  };

  it('selectPort dispatches an update to the server when completing a link', () => {
    runPortTest('PANDA-start', 'PANDA-enable');
  });

  it('selectPort handles ports being the wrong way round', () => {
    runPortTest('PANDA-enable', 'PANDA-start');
  });
});
