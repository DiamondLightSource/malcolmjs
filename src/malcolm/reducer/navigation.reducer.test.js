import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import NavTypes from '../NavTypes';

describe('navigation reducer', () => {
  it('updateNavigationPath set navigation on state', () => {
    let state = {
      blocks: {},
    };
    const blockPaths = ['PANDA', 'layout', 'PANDA:TTLIN1'];
    const payload = {
      blockPaths,
    };

    state = NavigationReducer.updateNavigationPath(state, payload);

    expect(state.navigation).not.toBeNull();
    const { navigationLists } = state.navigation;
    expect(navigationLists).not.toBeNull();
    expect(navigationLists).toHaveLength(3);
    expect(navigationLists[0].path).toEqual('PANDA');
    expect(navigationLists[0].basePath).toEqual('/PANDA/');
    expect(navigationLists[1].path).toEqual('layout');
    expect(navigationLists[1].basePath).toEqual('/PANDA/layout/');
    expect(navigationLists[2].path).toEqual('PANDA:TTLIN1');
    expect(navigationLists[2].basePath).toEqual('/PANDA/layout/PANDA:TTLIN1/');
  });

  it('resets the parent and child blocks when navigating to a different route', () => {
    let state = {
      parentBlock: 'parent',
      childBlock: 'child',
      blocks: {},
    };

    state = NavigationReducer.updateNavigationPath(state, { blockPaths: [] });

    expect(state.parentBlock).toBeUndefined();
    expect(state.childBlock).toBeUndefined();
  });
});

describe('NavigationReducer.updateNavTypes', () => {
  let state;

  beforeEach(() => {
    state = {
      blocks: {
        '.blocks': {
          children: ['PANDA', 'PANDA:SEQ2'],
        },
        PANDA: {
          attributes: [
            {
              calculated: {
                name: 'layout',
                children: ['SEQ1', 'SEQ2'],
              },
              raw: {
                meta: {
                  label: 'Layout',
                  tags: ['widget:flowgraph'],
                },
                value: {
                  name: ['SEQ1', 'SEQ2'],
                  mri: ['PANDA:SEQ1', 'PANDA:SEQ2'],
                },
              },
            },
          ],
          children: ['layout', 'health'],
        },
      },
      navigation: {
        navigationLists: [
          { path: 'PANDA' },
          { path: 'layout' },
          { path: 'SEQ2' },
          { path: '.info' },
        ],
      },
    };
  });

  it('updateNavTypes adds the nav type for each url element', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[0].navType).toEqual(NavTypes.Block);
    expect(state.navigation.navigationLists[1].navType).toEqual(
      NavTypes.Attribute
    );
    expect(state.navigation.navigationLists[2].navType).toEqual(NavTypes.Block);
    expect(state.navigation.navigationLists[3].navType).toEqual(NavTypes.Info);
  });

  it('updateNavTypes adds the nav type for palette', () => {
    state.navigation.navigationLists = [
      { path: 'PANDA' },
      { path: 'layout' },
      { path: '.palette' },
    ];
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[2].navType).toEqual(
      NavTypes.Palette
    );
  });

  it('updateNavTypes loads children for each nav element', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[0].children).toEqual([
      'layout',
      'health',
    ]);
    expect(state.navigation.navigationLists[0].childrenLabels).toEqual([
      'Layout',
      'health',
    ]);
    expect(state.navigation.navigationLists[0].label).toEqual('PANDA');

    expect(state.navigation.navigationLists[1].children).toEqual([
      'SEQ1',
      'SEQ2',
    ]);
    expect(state.navigation.navigationLists[1].childrenLabels).toEqual([
      'SEQ1',
      'SEQ2',
    ]);
    expect(state.navigation.navigationLists[1].label).toEqual('Layout');

    expect(state.navigation.navigationLists[2].label).toEqual('SEQ2');

    expect(state.navigation.navigationLists[3].label).toEqual('Info');
  });

  it('updateNavTypes sets parent/child blocks', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA:SEQ2');
    expect(state.mainAttribute).toEqual(undefined);
    expect(state.childBlock).toEqual('.info');
  });

  it('updateNavTypes sets parent/child blocks if palette', () => {
    state.navigation.navigationLists = [
      { path: 'PANDA' },
      { path: 'layout' },
      { path: '.palette' },
    ];
    state = NavigationReducer.updateNavTypes(state);

    expect(state.childBlock).toEqual('.palette');
  });

  it('updateNavTypes sets main attribute', () => {
    state.navigation.navigationLists = [
      { path: 'PANDA' },
      { path: 'layout' },
      { path: 'SEQ2' },
    ];

    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA');
    expect(state.mainAttribute).toEqual('layout');
    expect(state.childBlock).toEqual('PANDA:SEQ2');
  });

  it('updateNavTypes sets the parent to the block element if it is the only one', () => {
    state.navigation.navigationLists = [{ path: 'PANDA' }];

    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA');
  });

  it('updateNavTypes sets the parent to the last block element if there is an attribute at the end', () => {
    state.navigation.navigationLists = [
      { path: 'PANDA' },
      { path: 'layout' },
      { path: 'SEQ2' },
      { path: 'table' },
    ];

    state.blocks['PANDA:SEQ2'] = {
      attributes: [
        {
          calculated: {
            name: 'table',
          },
          raw: {},
        },
      ],
      children: ['table'],
    };

    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA:SEQ2');
    expect(state.mainAttribute).toEqual('table');
  });
});

describe('processNavigationLists', () => {
  let blocks;

  beforeEach(() => {
    blocks = {
      '.blocks': {
        children: ['block1', 'block2'],
      },
      block1: {
        label: 'block 1',
        attributes: [
          {
            name: 'layout',
            children: ['block5', 'block6'],
            value: {
              mri: ['block5', 'block6'],
              name: ['block5 display name', 'block6 display name'],
            },
          },
        ],
        children: ['block2'],
      },
      block2: {
        label: 'block 2',
        children: ['block3', 'block4'],
      },
    };
  });

  it('returns the .block blocks in the rootNav', () => {
    const navLists = processNavigationLists([], blocks);

    expect(navLists.rootNav.path).toBe('');
    expect(navLists.rootNav.children).toBe(blocks['.blocks'].children);
  });

  it('populates nav lists from blocks if present', () => {
    const paths = ['block1', 'block2'];
    const navLists = processNavigationLists(paths, blocks).navigationLists;

    expect(navLists).toHaveLength(2);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].label).toBe('block1');

    expect(navLists[1].path).toBe('block2');
    expect(navLists[1].label).toBe('block2');
  });

  it('populates nav lists from attributes of the previous block if no block is found', () => {
    const paths = ['block1', 'layout', 'block3'];
    const navLists = processNavigationLists(paths, blocks).navigationLists;

    expect(navLists).toHaveLength(3);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].label).toBe('block1');

    expect(navLists[1].path).toBe('layout');
    expect(navLists[1].label).toBe('layout');

    expect(navLists[2].path).toBe('block3');
    expect(navLists[2].label).toBe('block3');
  });
});
