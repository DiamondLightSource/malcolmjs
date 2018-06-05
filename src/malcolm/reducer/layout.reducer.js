const processLayout = malcolmState => {
  const layout = {
    blocks: [],
  };

  const parentBlock = malcolmState.blocks[malcolmState.parentBlock];
  if (parentBlock && parentBlock.attributes) {
    const attribute = malcolmState.blocks[
      malcolmState.parentBlock
    ].attributes.find(a => a.name === malcolmState.mainAttribute);

    if (attribute && attribute.layout) {
      const layoutBlocks = attribute.layout.blocks
        .filter(b => b.visible)
        .map(b => ({
          ...b,
          position: {
            x: b.position.x + window.innerWidth / 2,
            y: b.position.y + window.innerHeight / 2 - 64,
          },
        }))
        .map(b => {
          const hasMatchingBlock = Object.prototype.hasOwnProperty.call(
            malcolmState.blocks,
            b.mri
          );
          if (hasMatchingBlock) {
            const updatedBlock = { ...b };
            const matchingBlock = malcolmState.blocks[b.mri];

            updatedBlock.description = matchingBlock.label;

            if (matchingBlock.attributes) {
              const iconAttribute = matchingBlock.attributes.find(
                a => a.name === 'icon'
              );

              if (iconAttribute) {
                updatedBlock.icon = iconAttribute.value;
              }

              const inputs = matchingBlock.attributes.filter(
                a =>
                  a.meta &&
                  a.meta.tags.some(tag => tag.indexOf('inport:') !== -1)
              );
              const outputs = matchingBlock.attributes.filter(
                a =>
                  a.meta &&
                  a.meta.tags.some(tag => tag.indexOf('outport:') !== -1)
              );

              updatedBlock.ports = [
                ...inputs.map(input => ({
                  label: input.name,
                  input: true,
                })),
                ...outputs.map(output => ({
                  label: output.name,
                  input: false,
                })),
              ];

              return updatedBlock;
            }
          }

          return b;
        });
      layout.blocks = layoutBlocks;
    }
  }

  return layout;
};

export default {
  processLayout,
};
