import configureStore from 'redux-mock-store';
import BlockUtils from './blockUtils';

const buildAttribute = (name, tags = []) => ({
  name,
  meta: {
    tags,
  },
});

describe('Block Utilities', () => {
  let blocks = {};
  let layoutAttribute = {};

  beforeEach(() => {
    layoutAttribute = buildAttribute('layout');

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

  it('findAttributeIndex finds attribute in matching block', () => {
    const attribute = BlockUtils.findAttributeIndex(blocks, 'block1', 'layout');
    expect(attribute).toEqual(0);
  });

  it('findAttributeIndex returns undefined if block is not found', () => {
    const attribute = BlockUtils.findAttributeIndex(
      blocks,
      'not a block',
      'layout'
    );
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

  it('findAttributesWithTag returns attributes with matching tags', () => {
    const block = {
      attributes: [
        buildAttribute('att1', ['widget:test', 'another tag']),
        buildAttribute('att2', ['test']),
        buildAttribute('att3', ['widget:test']),
      ],
    };
    const attributes = BlockUtils.findAttributesWithTag(block, 'widget:test');

    expect(attributes).toHaveLength(2);
    expect(attributes[0]).toBe(block.attributes[0]);
    expect(attributes[1]).toBe(block.attributes[2]);
  });

  it('findAttributesWithTag uses partial matches', () => {
    const block = {
      attributes: [
        buildAttribute('att1', ['widget:test', 'another tag']),
        buildAttribute('att2', ['test']),
        buildAttribute('att3', ['widget:test']),
      ],
    };
    const attributes = BlockUtils.findAttributesWithTag(block, 'widget:');

    expect(attributes).toHaveLength(2);
    expect(attributes[0]).toBe(block.attributes[0]);
    expect(attributes[1]).toBe(block.attributes[2]);
  });

  it('findBlock returns block if it exists', () => {
    blocks = {
      block1: {
        name: 'block1',
      },
    };

    expect(BlockUtils.findBlock(blocks, 'block1')).toBe(blocks.block1);
  });

  it('findBlock returns undefined if block does not exist', () => {
    expect(BlockUtils.findBlock({}, 'block1')).toBeUndefined();
    expect(BlockUtils.findBlock(undefined, 'block1')).toBeUndefined();
  });

  it('attributeHasTag returns true if tag found', () => {
    expect(
      BlockUtils.attributeHasTag({ meta: { tags: ['tag1', 'tag2'] } }, 'tag1')
    ).toBeTruthy();
  });

  it('attributeHasTag returns false if tag not found', () => {
    expect(
      BlockUtils.attributeHasTag({ meta: { tags: ['tag1', 'tag2'] } }, 'tag3')
    ).toBeFalsy();
  });

  it('attributeHasTag returns false if no meta', () => {
    expect(BlockUtils.attributeHasTag({}, 'tag1')).toBeFalsy();
  });

  it('attributeHasTag returns false if no tags', () => {
    expect(BlockUtils.attributeHasTag({ meta: {} }, 'tag3')).toBeFalsy();
  });

  it('sets 404 flag if error message for failed block load', () => {
    const originalRequest = { path: ['block1', 'meta'] };
    const store = configureStore()({ malcolm: { blocks: { block1: {} } } });
    BlockUtils.didBlockLoadFail(originalRequest, store);
  });
});
