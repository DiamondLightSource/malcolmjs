import { malcolmSetFlag } from './malcolmActionCreators';

const didBlockLoadFail = (originalRequest, store) => {
  if (
    originalRequest.path.slice(-1)[0] === 'meta' &&
    !store.getState().malcolm.blocks[originalRequest.path[0]].attributes
  ) {
    store.dispatch(malcolmSetFlag([originalRequest.path[0]], 'loading', 404));
  }
};

const findBlock = (blocks, blockName) => blocks && blocks[blockName];

const findAttribute = (blocks, blockName, attributeName) => {
  const matchingBlock = findBlock(blocks, blockName);
  if (matchingBlock) {
    if (matchingBlock.attributes) {
      const matchingAttribute = matchingBlock.attributes.find(
        a =>
          a.calculated
            ? a.calculated.name === attributeName
            : a.name === attributeName
      );
      return matchingAttribute || undefined;
    }
  }

  return undefined;
};

const findAttributeIndex = (blocks, blockName, attributeName) => {
  const matchingBlock = findBlock(blocks, blockName);
  if (matchingBlock) {
    if (matchingBlock.attributes) {
      const matchingAttributeIndex = matchingBlock.attributes.findIndex(
        a =>
          a.calculated
            ? a.calculated.name === attributeName
            : a.name === attributeName
      );
      return matchingAttributeIndex;
    }
  }

  return undefined;
};

const findAttributesWithTag = (block, searchTag) =>
  block.attributes.filter(
    a =>
      (a.raw &&
        a.raw.meta &&
        a.raw.meta.tags.some(tag => tag.indexOf(searchTag) !== -1)) ||
      (a.meta && a.meta.tags.some(tag => tag.indexOf(searchTag) !== -1))
  );

const attributeHasTag = (attribute, tag) =>
  attribute &&
  ((attribute.meta &&
    attribute.meta.tags &&
    attribute.meta.tags.some(t => t.indexOf(tag) > -1)) ||
    (attribute.raw &&
      attribute.raw.meta &&
      attribute.raw.meta.tags &&
      attribute.raw.meta.tags.some(t => t.indexOf(tag) > -1)) ||
    (attribute.tags && attribute.tags.some(t => t.indexOf(tag) > -1)) ||
    (attribute.raw &&
      attribute.raw.tags &&
      attribute.raw.tags.some(t => t.indexOf(tag) > -1)));

export default {
  findBlock,
  findAttribute,
  findAttributeIndex,
  findAttributesWithTag,
  attributeHasTag,
  didBlockLoadFail,
};
