import navigationActions from './navigation.actions';
import NavTypes from '../NavTypes';
import { MalcolmNewBlock, MalcolmSend } from '../malcolm.types';

describe('subscribeToNewBlocksInRoute', () => {
  it('subscribes to new blocks', () => {
    const navAction = navigationActions.subscribeToNewBlocksInRoute();

    const dispatches = [];
    const state = {
      malcolm: {
        blocks: {
          PANDA: {},
        },
        navigation: {
          navigationLists: [
            {
              path: 'PANDA',
              navType: NavTypes.Block,
              blockMri: 'PANDA',
            },
            {
              path: 'layout',
              navType: NavTypes.Attribute,
            },
            {
              path: 'SEQ2',
              navType: NavTypes.Block,
              blockMri: 'PANDA:SEQ2',
            },
          ],
        },
      },
    };

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(2);
    expect(dispatches[0].type).toEqual(MalcolmNewBlock);
    expect(dispatches[0].payload.blockName).toEqual('PANDA:SEQ2');

    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[1].payload.path).toEqual(['PANDA:SEQ2', 'meta']);
  });
});

describe('navigateToAttribute', () => {
  it('changes the url to look at the attribute', () => {
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
              path: 'layout',
              navType: NavTypes.Attribute,
            },
            {
              path: 'SEQ2',
              navType: NavTypes.Block,
              blockMri: 'PANDA:SEQ2',
            },
          ],
        },
      },
    };

    const navAction = navigationActions.navigateToAttribute(
      'PANDA:SEQ2',
      'table'
    );

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual(
      '/gui/PANDA/layout/SEQ2/table'
    );
  });
});
