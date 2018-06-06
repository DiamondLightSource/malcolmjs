import blockUtils from '../blockUtils';

export const buildPorts = block => {
  const inputs = blockUtils.findAttributesWithTag(block, 'inport:');
  const outputs = blockUtils.findAttributesWithTag(block, 'outport:');

  return [
    ...inputs.map(input => ({
      label: input.name,
      input: true,
    })),
    ...outputs.map(output => ({
      label: output.name,
      input: false,
    })),
  ];
};

export const offSetPosition = layoutBlock => ({
  ...layoutBlock,
  position: {
    x: layoutBlock.position.x + window.innerWidth / 2,
    y: layoutBlock.position.y + window.innerHeight / 2 - 64,
  },
});

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
        .map(b => offSetPosition(b))
        .map(b => {
          const matchingBlock = blockUtils.findBlock(
            malcolmState.blocks,
            b.mri
          );
          if (matchingBlock && matchingBlock.attributes) {
            const updatedBlock = { ...b };
            updatedBlock.description = matchingBlock.label;

            const iconAttribute = blockUtils.findAttributesWithTag(
              matchingBlock,
              'widget:icon'
            );

            if (iconAttribute.length > 0) {
              updatedBlock.icon = iconAttribute[0].value;
            }

            updatedBlock.ports = buildPorts(matchingBlock);

            return updatedBlock;
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
