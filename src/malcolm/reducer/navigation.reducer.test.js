import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';

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
    expect(state.navigation).toHaveLength(3);
    expect(state.navigation[0].path).toEqual('PANDA');
    expect(state.navigation[0].basePath).toEqual('/');
    expect(state.navigation[1].path).toEqual('layout');
    expect(state.navigation[1].basePath).toEqual('/PANDA/');
    expect(state.navigation[2].path).toEqual('PANDA:TTLIN1');
    expect(state.navigation[2].basePath).toEqual('/PANDA/layout/');
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

describe('processNavigationLists', () => {
  let blocks;

  beforeEach(() => {
    blocks = {
      '.blocks': {
        children: ['block1', 'block2'],
      },
      block1: {
        attributes: [
          {
            name: 'layout',
            children: ['block5', 'block6'],
          },
        ],
        children: ['block2'],
      },
      block2: {
        children: ['block3', 'block4'],
      },
    };
  });

  it('returns the .block blocks if the paths are empty', () => {
    const navLists = processNavigationLists([], blocks);

    expect(navLists).toHaveLength(1);
    expect(navLists[0].path).toBe('');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);
  });

  it('populates nav lists from blocks if present', () => {
    const paths = ['block1', 'block2'];
    const navLists = processNavigationLists(paths, blocks);

    expect(navLists).toHaveLength(2);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);

    expect(navLists[1].path).toBe('block2');
    expect(navLists[1].children).toBe(blocks.block1.children);
  });

  it('populates nav lists from attributes of the previous block if no block is found', () => {
    const paths = ['block1', 'layout', 'block3'];
    const navLists = processNavigationLists(paths, blocks);

    expect(navLists).toHaveLength(3);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);

    expect(navLists[1].path).toBe('layout');
    expect(navLists[1].children).toBe(blocks.block1.children);

    expect(navLists[2].path).toBe('block3');
    expect(navLists[2].children).toEqual(['block5', 'block6']);
  });
});
