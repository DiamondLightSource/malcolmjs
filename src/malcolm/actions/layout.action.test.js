import LayoutActions, { selectPort } from './layout.action';
import {
  MalcolmSelectPortType,
  MalcolmAttributeFlag,
  MalcolmSend,
  MalcolmMakeBlockVisibleType,
  MalcolmSelectBlock,
} from '../malcolm.types';

describe('layout actions', () => {
  let actions = [];
  let state = {};
  let dispatch;
  const getState = () => state;

  beforeEach(() => {
    actions = [];
    dispatch = action => {
      if (typeof action === 'function') {
        action(dispatch, getState);
      } else {
        actions.push(action);
      }
    };

    state = {
      malcolm: {
        parentBlock: 'PANDA',
        mainAttribute: 'layout',
        blocks: {
          PANDA: {
            attributes: [
              {
                raw: {
                  value: {
                    mri: ['PANDA'],
                    name: ['PANDA 1'],
                  },
                },
                calculated: {
                  name: 'layout',
                },
              },
            ],
          },
        },
        layoutState: {
          startPortForLink: undefined,
          endPortForLink: undefined,
          layoutCenter: {
            x: 0,
            y: 0,
          },
        },
        layout: {
          blocks: [
            {
              mri: 'PANDA',
              visible: true,
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

  it('deleteBlocks makes the block invisible', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA'];

    const action = LayoutActions.deleteBlocks();
    action(dispatch, getState);

    expect(actions).toHaveLength(4);
    expect(actions[0].type).toEqual(MalcolmMakeBlockVisibleType);
    expect(actions[1].type).toEqual(MalcolmAttributeFlag);
    expect(actions[2].type).toEqual(MalcolmSend);
    expect(actions[2].payload.typeid).toEqual('malcolm:core/Put:1.0');
    expect(actions[2].payload.path).toEqual(['PANDA', 'layout', 'value']);
    expect(actions[2].payload.value).toEqual({
      mri: ['PANDA'],
      name: ['PANDA 1'],
      visible: [false],
      x: [0],
      y: [0],
    });

    expect(actions[3].type).toEqual(MalcolmSelectBlock);
  });
});
