import LayoutReducer, {
  buildPorts,
  offSetPosition,
  updateLayoutBlock,
} from './layout.reducer';

const buildLayoutBlock = () => ({
  mri: 'block1',
  position: {
    x: 10,
    y: 20,
  },
  visible: true,
});

const buildMalcolmState = () => ({
  blocks: {
    block1: {
      label: 'block1 label',
      attributes: [
        {
          meta: {
            tags: ['widget:icon'],
          },
          value: 'icon 123',
        },
        {
          name: 'att1',
          meta: {
            tags: ['inport:bool:ZERO'],
          },
        },
        {
          name: 'layout',
          layout: {
            blocks: [buildLayoutBlock()],
          },
        },
      ],
    },
  },
});

describe('Layout Reducer', () => {
  it('buildPorts builds the port array correctly', () => {
    const block = {
      attributes: [
        {
          name: 'att1',
          meta: {
            tags: ['inport:bool:ZERO'],
          },
        },
        {
          name: 'att2',
          meta: {
            tags: ['outport:bool:SEQ1'],
          },
        },
        {
          name: 'att3',
          meta: {
            tags: ['inport:bool:ZERO'],
          },
        },
      ],
    };

    const ports = buildPorts(block);

    expect(ports).toHaveLength(3);
    expect(ports[0].label).toEqual('att1');
    expect(ports[0].input).toBeTruthy();
    expect(ports[1].label).toEqual('att3');
    expect(ports[1].input).toBeTruthy();
    expect(ports[2].label).toEqual('att2');
    expect(ports[2].input).toBeFalsy();
  });

  it('offSetPosition moves the blocks to the center of the layout area', () => {
    const updatedBlock = offSetPosition(buildLayoutBlock());

    expect(updatedBlock.position.x).toEqual(10 + 512);
    expect(updatedBlock.position.y).toEqual(20 + 768 / 2 - 64);
  });

  it('updateLayoutBlock updates the icon on a layout block', () => {
    const updatedLayoutBlock = updateLayoutBlock(
      buildLayoutBlock(),
      buildMalcolmState()
    );
    expect(updatedLayoutBlock.icon).toEqual('icon 123');
  });

  it('updateLayoutBlock updates the description of a layout block', () => {
    const updatedLayoutBlock = updateLayoutBlock(
      buildLayoutBlock(),
      buildMalcolmState()
    );
    expect(updatedLayoutBlock.description).toEqual('block1 label');
  });

  it('updateLayoutBlock updates the ports of a layout block', () => {
    const updatedLayoutBlock = updateLayoutBlock(
      buildLayoutBlock(),
      buildMalcolmState()
    );
    expect(updatedLayoutBlock.ports).toHaveLength(1);
  });

  it('updateLayoutBlock returns the same layout block if no malcolm block is found', () => {
    const layoutBlock = {
      mri: 'non-existent block',
    };

    const updatedLayoutBlock = updateLayoutBlock(
      layoutBlock,
      buildMalcolmState()
    );
    expect(updatedLayoutBlock).toBe(layoutBlock);
  });

  it('processLayout returns a blank layout if the parent is not set', () => {
    const state = {
      blocks: {},
      parentBlock: undefined,
    };

    const layout = LayoutReducer.processLayout(state);

    expect(layout.blocks).toHaveLength(0);
  });

  it('processLayout returns a blank layout if the parent has no attributes', () => {
    const state = {
      blocks: {
        block1: {},
      },
      parentBlock: 'block1',
    };

    const layout = LayoutReducer.processLayout(state);

    expect(layout.blocks).toHaveLength(0);
  });

  it('processLayout returns a blank layout if the main attribute is not layout', () => {
    const state = buildMalcolmState();
    state.parentBlock = 'block1';
    state.mainAttribute = 'health';

    const layout = LayoutReducer.processLayout(state);

    expect(layout.blocks).toHaveLength(0);
  });

  it('processLayout processes the layout correctly if the main attribute is layout', () => {
    const state = buildMalcolmState();
    state.parentBlock = 'block1';
    state.mainAttribute = 'layout';

    const layout = LayoutReducer.processLayout(state);

    expect(layout.blocks).toHaveLength(1);
    expect(layout.blocks[0].icon).toEqual('icon 123');
    expect(layout.blocks[0].position.x).toEqual(522);
    expect(layout.blocks[0].ports[0].label).toEqual('att1');
  });
});
