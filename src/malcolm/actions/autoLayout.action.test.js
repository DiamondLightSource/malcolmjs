import ELK from 'elkjs/lib/elk.bundled';
import autoLayoutAction from './autoLayout.action';
import { MalcolmSend, MalcolmAttributeFlag } from '../malcolm.types';
import { idSeparator } from '../../layout/layout.component';

jest.mock('elkjs/lib/elk.bundled');

describe('auto layout actions', () => {
  it('runAutoLayout updates block positions', async () => {
    ELK.mockImplementation(() => ({
      layout: () =>
        Promise.resolve({
          children: [
            { id: 'block1', x: -107, y: 0 },
            { id: 'block2', x: 107, y: 0 },
          ],
        }),
    }));

    const action = autoLayoutAction.runAutoLayout();

    const actions = [];
    const dispatch = a => actions.push(a);

    const getState = () => ({
      malcolm: {
        layout: {
          blocks: [
            {
              mri: 'block1',
              name: 'block 1',
              visible: true,
              position: {
                x: 0,
                y: 0,
              },
              ports: [
                {
                  input: false,
                  label: 'out',
                },
              ],
            },
            {
              mri: 'block2',
              name: 'block 2',
              visible: true,
              position: {
                x: 300,
                y: 0,
              },
              ports: [
                {
                  input: true,
                  label: 'in',
                },
              ],
            },
          ],
        },
        layoutState: {
          layoutCenter: {
            x: 1,
            y: 100,
          },
        },
        parentBlock: 'PANDA',
        mainAttribute: 'layout',
        layoutEngine: {
          getNodeDimensions: () => ({ height: 120 }),
          diagramModel: {
            links: {
              link1: {
                id: `block1${idSeparator}block1-out${idSeparator}block2${idSeparator}block2-in`,
                sourcePort: {
                  id: 'block1-out',
                },
                targetPort: {
                  id: 'block2-in',
                },
              },
            },
            zoom: 100,
            nodes: {
              block1: {},
              block2: {},
            },
          },
        },
      },
    });

    await action(dispatch, getState);

    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual(MalcolmAttributeFlag);
    expect(actions[0].payload.path).toEqual(['PANDA', 'layout']);
    expect(actions[0].payload.flagType).toEqual('pending');
    expect(actions[0].payload.flagState).toEqual(true);

    expect(actions[1].type).toEqual(MalcolmSend);
    expect(actions[1].payload.typeid).toEqual('malcolm:core/Put:1.0');
    expect(actions[1].payload.path).toEqual(['PANDA', 'layout', 'value']);
    expect(actions[1].payload.value).toEqual({
      mri: ['block1', 'block2'],
      name: ['block 1', 'block 2'],
      visible: [true, true],
      x: [-107, 107],
      y: [0, 0],
    });
  });
});
