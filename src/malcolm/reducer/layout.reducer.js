import blockUtils from '../blockUtils';

export const buildPorts = block => {
  const inputs = blockUtils.findAttributesWithTag(block, 'inport:');
  const outputs = blockUtils.findAttributesWithTag(block, 'outport:');

  return [
    ...inputs.map(input => ({
      label: input.name,
      input: true,
      tag: input.meta.tags
        .find(t => t.indexOf('inport:') > -1)
        .split(':')
        .slice(-1)[0],
      value: input.value,
    })),
    ...outputs.map(output => ({
      label: output.name,
      input: false,
      tag: output.meta.tags
        .find(t => t.indexOf('outport:') > -1)
        .split(':')
        .slice(-1)[0],
    })),
  ];
};

export const offSetPosition = (layoutBlock, center) => ({
  ...layoutBlock,
  position: {
    x: layoutBlock.position.x + center.x,
    y: layoutBlock.position.y + center.y,
  },
});

export const updateLayoutBlock = (layoutBlock, malcolmState) => {
  const matchingBlock = blockUtils.findBlock(
    malcolmState.blocks,
    layoutBlock.mri
  );
  if (matchingBlock && matchingBlock.attributes) {
    const updatedBlock = { ...layoutBlock };
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

  return layoutBlock;
};

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
        .map(b => offSetPosition(b, malcolmState.layoutState.layoutCenter))
        .map(b => updateLayoutBlock(b, malcolmState));
      layout.blocks = layoutBlocks;
    }
  }

  // restore selected state
  layout.blocks.forEach(b => {
    const currentBlock = b;
    const oldBlock = malcolmState.layout.blocks.find(
      old => old.mri === currentBlock.mri
    );
    currentBlock.selected = oldBlock ? oldBlock.selected : false;
  });

  return layout;
};

const updateBlockPosition = (malcolmState, translation) => {
  const parentBlock = malcolmState.blocks[malcolmState.parentBlock];
  if (parentBlock && parentBlock.attributes) {
    const attribute = malcolmState.blocks[
      malcolmState.parentBlock
    ].attributes.find(a => a.name === malcolmState.mainAttribute);

    if (attribute && attribute.layout) {
      const layoutBlocks = attribute.layout.blocks.map(
        b =>
          malcolmState.layoutState.selectedBlocks.some(name => name === b.mri)
            ? {
                ...b,
                position: {
                  x: b.position.x + translation.x,
                  y: b.position.y + translation.y,
                },
              }
            : b
      );

      attribute.layout.blocks = layoutBlocks;
    }
  }
};

const selectBlock = (malcolmState, blockName) => {
  const { shiftIsPressed, selectedBlocks } = malcolmState.layoutState;

  const updatedBlocks = selectedBlocks.find(b => b === blockName)
    ? selectedBlocks
    : [...selectedBlocks, blockName];
  return {
    ...malcolmState.layoutState,
    selectedBlocks: shiftIsPressed ? updatedBlocks : [blockName],
  };
};

const shiftIsPressed = (malcolmState, payload) => ({
  ...malcolmState,
  layoutState: {
    ...malcolmState.layoutState,
    shiftIsPressed: payload.shiftIsPressed,
  },
});

const findPort = (blocks, id) => {
  const path = id.split('-');
  const block = blocks.find(b => b.mri === path[0]);
  const port = block.ports.find(p => p.label === path[1]);

  return port;
};

const selectPortForLink = (malcolmState, portId, start) => {
  let { startPortForLink, endPortForLink } = malcolmState.layoutState;

  if (startPortForLink && endPortForLink) {
    // Reset
    startPortForLink = undefined;
    endPortForLink = undefined;
  }

  startPortForLink = start ? portId : startPortForLink;
  endPortForLink = !start ? portId : undefined;

  const { layout } = malcolmState;

  if (startPortForLink && endPortForLink) {
    layout.blocks = [...layout.blocks];
    const startPort = findPort(layout.blocks, startPortForLink);
    const endPort = findPort(layout.blocks, endPortForLink);

    const inputPort = startPort.input ? startPort : endPort;
    const outputPort = startPort.input ? endPort : startPort;
    inputPort.value = outputPort.tag;
  }

  return {
    ...malcolmState,
    layout,
    layoutState: {
      ...malcolmState.layoutState,
      startPortForLink,
      endPortForLink,
    },
  };
};

export default {
  processLayout,
  updateBlockPosition,
  selectBlock,
  shiftIsPressed,
  selectPortForLink,
};
