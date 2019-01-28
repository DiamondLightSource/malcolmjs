import LayoutActions, { selectPort } from './layout.action';
import {
  MalcolmSelectPortType,
  MalcolmAttributeFlag,
  MalcolmSend,
  MalcolmMakeBlockVisibleType,
  MalcolmSelectBlock,
  MalcolmSelectLinkType,
} from '../malcolm.types';
import { idSeparator } from '../../layout/layout.component';
import { sinkPort, sourcePort } from '../malcolmConstants';

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
                    mri: ['PANDA', 'PANDA:INENC1'],
                    name: ['PANDA 1', 'Test Encoder'],
                  },
                },
                calculated: {
                  name: 'layout',
                },
              },
              {
                raw: {
                  meta: {
                    tags: [`${sourcePort}bool:PANDA.test`],
                  },
                },
                calculated: {
                  name: 'testOut1',
                },
              },
              {
                raw: {
                  meta: {
                    tags: [`${sinkPort}bool:ONE`],
                  },
                },
                calculated: {
                  name: 'testIn1',
                },
              },
            ],
          },
          'PANDA:INENC1': {
            attributes: [
              {
                raw: {
                  meta: {
                    tags: [`${sinkPort}bool:ZERO`],
                    writeable: true,
                  },
                },
                calculated: {
                  name: 'testIn2',
                },
              },
              {
                raw: {
                  meta: {
                    tags: [`${sourcePort}bool:INENC1.test`],
                  },
                },
                calculated: {
                  name: 'testOut2',
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
    const action = selectPort('PANDA•enable', true);
    action(dispatch, getState);

    expect(actions.length).toBeGreaterThanOrEqual(1);
    expect(actions[0].type).toEqual(MalcolmSelectPortType);
    expect(actions[0].payload.portId).toEqual('PANDA•enable');
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
    runPortTest('PANDA•start', 'PANDA•enable');
  });

  it('selectPort handles ports being the wrong way round', () => {
    runPortTest('PANDA•enable', 'PANDA•start');
  });

  it('deleteBlocks makes the block invisible', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA', 'PANDA:INENC1'];

    const action = LayoutActions.deleteBlocks();
    action(dispatch, getState);

    expect(actions).toHaveLength(6);
    expect(actions[0].type).toEqual(MalcolmMakeBlockVisibleType);
    expect(actions[1].type).toEqual(MalcolmMakeBlockVisibleType);
    expect(actions[2].type).toEqual(MalcolmAttributeFlag);
    expect(actions[3].type).toEqual(MalcolmSend);
    expect(actions[3].payload.typeid).toEqual('malcolm:core/Put:1.0');
    expect(actions[3].payload.path).toEqual(['PANDA', 'layout', 'value']);
    expect(actions[3].payload.value).toEqual({
      mri: ['PANDA', 'PANDA:INENC1'],
      name: ['PANDA 1', 'Test Encoder'],
      visible: [false, false],
      x: [0, 0],
      y: [0, 0],
    });

    expect(actions[4].type).toEqual(MalcolmSelectBlock);
    expect(actions[5].type).toEqual(MalcolmSelectBlock);
  });

  it('deleteLinks puts null port value to selected link attribute iff writeable', () => {
    state.malcolm.layoutState.selectedLinks = [
      `PANDA${idSeparator}testOut1${idSeparator}PANDA:INENC1${idSeparator}testIn2`,
      `PANDA:INENC1${idSeparator}testOut2${idSeparator}PANDA${idSeparator}testIn1`,
    ];

    const action = LayoutActions.deleteLinks();
    action(dispatch, getState);

    expect(actions).toHaveLength(3);
    expect(actions[0].type).toEqual(MalcolmAttributeFlag);
    expect(actions[1].type).toEqual(MalcolmSend);
    expect(actions[1].payload.typeid).toEqual('malcolm:core/Put:1.0');
    expect(actions[1].payload.path).toEqual(['PANDA:INENC1', 'testIn2']);
    expect(actions[1].payload.value).toEqual('ZERO');
    expect(actions[2].type).toEqual(MalcolmSelectLinkType);
  });
});
