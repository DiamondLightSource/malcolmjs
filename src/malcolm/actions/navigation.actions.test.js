import navigationActions from './navigation.actions';
import NavTypes from '../NavTypes';
import { MalcolmNewBlock, MalcolmSend } from '../malcolm.types';
import { buildAttribute, buildMeta } from '../../testState.utilities';
import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';

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
      viewType: 'gui',
    },
  },
  viewState: {
    popout: false,
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

describe('subscribeToChildren', () => {
  it('fires subscription for child blocks', () => {
    const dispatches = [];
    const state = buildNavState();
    // eslint-disable-next-line prefer-destructuring
    state.malcolm.navigation.navigationLists[1].parent =
      state.malcolm.navigation.navigationLists[0];
    state.malcolm.navigation.navigationLists.pop();
    state.malcolm.blocks.PANDA.attributes = [
      buildAttribute(
        'layout',
        ['PANDA', 'layout'],
        {
          mri: ['PANDA:Test1', 'PANDA:Test2', 'PANDA:Test3'],
          visible: [true, false, true],
        },
        undefined,
        buildMeta(['widget:flowgraph']),
        ['Test1', 'Test2', 'Test3']
      ),
    ];

    const navAction = navigationActions.subscribeToChildren();

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(4);
    expect(dispatches[0]).toEqual(
      malcolmNewBlockAction('PANDA:Test1', false, false)
    );
    expect(dispatches[2]).toEqual(
      malcolmNewBlockAction('PANDA:Test3', false, false)
    );
    expect(dispatches[1]).toEqual(
      malcolmSubscribeAction(['PANDA:Test1', 'meta'])
    );
    expect(dispatches[3]).toEqual(
      malcolmSubscribeAction(['PANDA:Test3', 'meta'])
    );
  });

  it('does nothing if last nav element is not an attribute', () => {
    const dispatches = [];
    const state = buildNavState();
    // eslint-disable-next-line prefer-destructuring
    state.malcolm.navigation.navigationLists[1].parent =
      state.malcolm.navigation.navigationLists[0];
    // eslint-disable-next-line prefer-destructuring
    state.malcolm.navigation.navigationLists[2].parent =
      state.malcolm.navigation.navigationLists[1];
    state.malcolm.blocks.PANDA.attributes = [
      buildAttribute(
        'layout',
        ['PANDA', 'layout'],
        {
          mri: ['PANDA:Test1', 'PANDA:Test2', 'PANDA:Test3'],
          visible: [true, false, true],
        },
        undefined,
        undefined,
        ['Test1', 'Test2', 'Test3']
      ),
    ];

    const navAction = navigationActions.subscribeToChildren();

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(0);
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
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ2/table',
      search: '',
    });
  });
});

describe('navigateToPalette', () => {
  it('changes the url to show the palette', () => {
    const dispatches = [];
    const state = buildNavState();
    state.malcolm.navigation.navigationLists.push({
      navType: NavTypes.Palette,
      path: '.palette',
    });

    const navAction = navigationActions.navigateToPalette();

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/',
      search: '',
    });
  });

  it('closes the palette if it is already open', () => {
    const dispatches = [];
    const state = buildNavState();

    const navAction = navigationActions.navigateToPalette();

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/.palette',
      search: '',
    });
  });
});

describe('navigateToInfo', () => {
  it('changes the url to show the info pane', () => {
    const dispatches = [];
    const state = buildNavState();

    const navAction = navigationActions.navigateToInfo('PANDA', 'layout');

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/.info',
      search: '',
    });
  });
  it('changes the url to show the info pane', () => {
    const dispatches = [];
    const state = buildNavState();
    state.malcolm.navigation.navigationLists.push({
      path: 'table',
      navType: NavTypes.Attribute,
      subElement: ['row', '1'],
    });
    const navAction = navigationActions.navigateToInfo(
      'PANDA:SEQ2',
      'table',
      'row.1'
    );

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ2/table.row.1/.info',
      search: '',
    });
  });
});

describe('navigateToSubElement', () => {
  it('changes the url to show the sub-element with no info pane', () => {
    const dispatches = [];
    const state = buildNavState();
    state.malcolm.navigation.navigationLists.push({
      path: 'table',
      navType: NavTypes.Attribute,
    });
    const navAction = navigationActions.navigateToSubElement(
      'PANDA:SEQ2',
      'table',
      'row.1'
    );

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ2/table.row.1/',
      search: '',
    });
  });

  it('changes the url to show the sub-element with info pane', () => {
    const dispatches = [];
    const state = buildNavState();
    state.malcolm.navigation.navigationLists.push({
      path: 'table',
      navType: NavTypes.Attribute,
    });
    state.malcolm.navigation.navigationLists.push({
      path: '.info',
      navType: NavTypes.Info,
    });
    const navAction = navigationActions.navigateToSubElement(
      'PANDA:SEQ2',
      'table',
      'row.1'
    );

    navAction(action => dispatches.push(action), () => state);

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual('@@router/CALL_HISTORY_METHOD');
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ2/table.row.1/.info',
      search: '',
    });
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
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ1',
      search: '',
    });
  });

  it('updateChildPanel replaces the end of the route if it does not end in layout', () => {
    const navAction = navigationActions.updateChildPanel('SEQ1');
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout/SEQ1',
      search: '',
    });
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
    expect(dispatches[0].payload.args[0]).toEqual({
      pathname: '/gui/PANDA/layout',
      search: '',
    });
  });
  it('closeChildPanel does nothing if no child panel is open', () => {
    state.malcolm.navigation.navigationLists.pop();
    const navAction = navigationActions.closeChildPanel();
    navAction(action => dispatches.push(action), () => state);
    expect(dispatches.length).toEqual(0);
  });
});
