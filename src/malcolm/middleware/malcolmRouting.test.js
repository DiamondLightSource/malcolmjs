import handleLocationChange from './malcolmRouting';
import NavTypes from '../NavTypes';
import { MalcolmNewBlock, MalcolmSend } from '../malcolm.types';

describe('malcolm routing', () => {
  it('handleLocationChange subscribes to new blocks in url', () => {
    const dispatches = [];
    const state = {
      malcolm: {
        navigation: {
          navigationLists: [
            {
              path: 'PANDA',
              navType: NavTypes.Block,
              blockMri: 'PANDA',
            },
            {
              path: 'SEQ2',
              navType: NavTypes.Block,
              blockMri: 'PANDA:SEQ2',
            },
          ],
        },
        blocks: {
          '.blocks': {},
          PANDA: {},
        },
      },
    };

    handleLocationChange(
      '/gui/PANDA',
      state.malcolm.blocks,
      action => dispatches.push(action),
      () => state
    );

    expect(dispatches).toHaveLength(3);
    expect(dispatches[1].type).toEqual(MalcolmNewBlock);
    expect(dispatches[1].payload.blockName).toEqual('PANDA:SEQ2');

    expect(dispatches[2].type).toEqual(MalcolmSend);
    expect(dispatches[2].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[2].payload.path).toEqual(['PANDA:SEQ2', 'meta']);
  });
});
