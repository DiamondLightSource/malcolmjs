import NavBarSelector from './navbar.selector';

describe('NavBarSelector', () => {
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
    const navLists = NavBarSelector.processNavigationLists([], blocks);

    expect(navLists).toHaveLength(1);
    expect(navLists[0].path).toBe('');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);
  });

  it('populates nav lists from blocks if present', () => {
    const paths = ['block1', 'block2'];
    const navLists = NavBarSelector.processNavigationLists(paths, blocks);

    expect(navLists).toHaveLength(2);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);

    expect(navLists[1].path).toBe('block2');
    expect(navLists[1].children).toBe(blocks.block1.children);
  });

  it('populates nav lists from attributes of the previous block if no block is found', () => {
    const paths = ['block1', 'layout', 'block3'];
    const navLists = NavBarSelector.processNavigationLists(paths, blocks);

    expect(navLists).toHaveLength(3);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].children).toBe(blocks['.blocks'].children);

    expect(navLists[1].path).toBe('layout');
    expect(navLists[1].children).toBe(blocks.block1.children);

    expect(navLists[2].path).toBe('block3');
    expect(navLists[2].children).toEqual(['block5', 'block6']);
  });
});
