import BlockUtils from './blockUtils';

describe('Block Utilities', () => {
  let blocks = {};
  let layoutAttribute = {};

  beforeEach(() => {
    layoutAttribute = {
      name: 'layout',
    };

    blocks = {
      block1: {
        attributes: [layoutAttribute],
      },
      blockWithoutAttributes: {},
    };
  });

  it('findAttribute finds attribute in matching block', () => {
    const attribute = BlockUtils.findAttribute(blocks, 'block1', 'layout');
    expect(attribute).toBe(layoutAttribute);
  });

  it('findAttribute returns undefined if block is not found', () => {
    const attribute = BlockUtils.findAttribute(blocks, 'not a block', 'layout');
    expect(attribute).toBeUndefined();
  });

  it('findAttribute returns undefined if block has no attributes', () => {
    const attribute = BlockUtils.findAttribute(
      blocks,
      'blockWithoutAttributes',
      'layout'
    );
    expect(attribute).toBeUndefined();
  });

  it('findAttribute returns undefined if no matching attributes', () => {
    const attribute = BlockUtils.findAttribute(
      blocks,
      'block1',
      'not an attribute'
    );
    expect(attribute).toBeUndefined();
  });
});
