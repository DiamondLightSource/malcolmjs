const findAttribute = (blocks, blockName, attributeName) => {
  const hasMatchingBlock = Object.prototype.hasOwnProperty.call(
    blocks,
    blockName
  );
  if (hasMatchingBlock) {
    const matchingBlock = blocks[blockName];
    if (matchingBlock.attributes) {
      const matchingAttribute = matchingBlock.attributes.find(
        a => a.name === attributeName
      );

      return matchingAttribute || undefined;
    }
  }

  return undefined;
};

export default {
  findAttribute,
};
