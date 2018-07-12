import navigationActions from './navigation.actions';
import NavTypes from '../NavTypes';
import { MalcolmNewBlock, MalcolmSend } from '../malcolm.types';

const buildNavState = () => ({
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
});

describe('subscribeToNewBlocksInRoute', () => {
  it('subscribes to new blocks', () => {
    const navAction = navigationActions.subscribeToNewBlocksInRoute();

    const dispatches = [];
    const state = buildNavState();

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
    const state = buildNavState();

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

describe('navigateToPalette', () => {
  it('changes the url to show the palette', () => {
    const dispatches = [];
    const state = buildNavState();

    const navAction = navigationActions.navigateToPalette();

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual('/gui/PANDA/layout/.palette');
  });
});

describe('updateChildPanel', () => {
  let state;
  let dispatches;
  beforeEach(() => {
    dispatches = [];
    state = buildNavState();
  });
  it('updateChildPanel adds to the end of the route if it ends in layout', () => {
    state.malcolm.navigation.navigationLists.pop();
    const navAction = navigationActions.updateChildPanel('SEQ1');
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches[0].payload.args[0]).toEqual('/gui/PANDA/layout/SEQ1');
  });

  it('updateChildPanel replaces the end of the route if it does not end in layout', () => {
    const navAction = navigationActions.updateChildPanel('SEQ1');
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches[0].payload.args[0]).toEqual('/gui/PANDA/layout/SEQ1');
  });
});

describe('closeChildPanel', () => {
  let state;
  let dispatches;
  beforeEach(() => {
    dispatches = [];
    state = buildNavState();
  });

  it('closeChildPanel updates the route to remove the child', () => {
    const navAction = navigationActions.closeChildPanel();
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches[0].payload.args[0]).toEqual('/gui/PANDA/layout');
  });
  it('closeChildPanel does nothing if no child panel is open', () => {
    state.malcolm.navigation.navigationLists.pop();
    const navAction = navigationActions.closeChildPanel();
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches.length).toEqual(0);
  });
});
