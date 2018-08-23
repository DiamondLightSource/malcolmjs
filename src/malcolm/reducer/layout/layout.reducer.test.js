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
  layout: {
    blocks: [
      {
        mri: 'block1',
      },
    ],
  },
  layoutState: {
    layoutCenter: {
      x: 100,
      y: 150,
    },
    selectedBlocks: ['block1'],
  },
  blocks: {
    block1: {
      label: 'block1 label',
      attributes: [
        {
          raw: {
            meta: {
              tags: ['widget:icon'],
            },
            value: 'icon 123',
          },
          calculated: {
            loading: true,
          },
        },
        {
          calculated: {
            name: 'att1',
            loading: true,
          },
          raw: {
            meta: {
              tags: ['inport:bool:ZERO'],
            },
          },
        },
        {
          calculated: {
            name: 'layout',
            layout: {
              blocks: [buildLayoutBlock()],
            },
            loading: true,
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
          calculated: {
            name: 'att1',
          },
          raw: {
            meta: {
              tags: ['inport:bool:ZERO'],
            },
          },
        },
        {
          calculated: {
            name: 'att2',
          },
          raw: {
            meta: {
              tags: ['outport:bool:SEQ1'],
            },
          },
        },
        {
          calculated: {
            name: 'att3',
          },
          raw: {
            meta: {
              tags: ['inport:bool:ZERO'],
            },
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
    const updatedBlock = offSetPosition(buildLayoutBlock(), { x: 100, y: 150 });

    expect(updatedBlock.position.x).toEqual(10 + 100);
    expect(updatedBlock.position.y).toEqual(20 + 150);
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
    expect(layout.blocks[0].position.x).toEqual(110);
    expect(layout.blocks[0].ports[0].label).toEqual('att1');
  });

  it('selectBlock adds to selection if isSelected is true', () => {
    const state = buildMalcolmState();
    state.layoutState.selectedBlocks = ['block2'];
    const layout = LayoutReducer.selectBlock(state, 'block1', true);

    expect(layout.selectedBlocks).toEqual(['block2', 'block1']);
  });

  it('selectBlock removes from selection if isSelected is false', () => {
    const state = buildMalcolmState();
    state.layoutState.selectedBlocks = ['block2'];
    const layout = LayoutReducer.selectBlock(state, 'block2', false);

    expect(layout.selectedBlocks).toEqual([]);
  });

  it('selectBlock does not change selected if block is already selected', () => {
    const state = buildMalcolmState();
    state.layoutState.selectedBlocks = ['block2'];
    const layout = LayoutReducer.selectBlock(state, 'block2', true);

    expect(layout.selectedBlocks).toBe(state.layoutState.selectedBlocks);
  });

  it('updateBlockPosition updates the positions of selected blocks', () => {
    const state = buildMalcolmState();
    state.layoutState.selectedBlocks = ['block1'];
    state.parentBlock = 'block1';
    state.mainAttribute = 'layout';

    LayoutReducer.updateBlockPosition(state, { x: 100, y: 200 });
    const { layout } = state.blocks.block1.attributes[2].calculated;
    expect(layout.blocks[0].position.x).toEqual(110);
    expect(layout.blocks[0].position.y).toEqual(220);
  });

  it('selectPortForLink resets the ports in links if both are undefined', () => {
    let state = buildMalcolmState();
    state.layoutState.startPortForLink = 'start';
    state.layoutState.endPortForLink = 'end';

    state = LayoutReducer.selectPortForLink(state, 'port', true);
    expect(state.layoutState.startPortForLink).toEqual('port');
    expect(state.layoutState.endPortForLink).toBeUndefined();
  });

  it('selectPortForLink optimistically adds a link if the end port is being set', () => {
    let state = buildMalcolmState();
    state.layoutState.startPortForLink = 'PANDA-start';
    state.layout.blocks = [
      {
        mri: 'PANDA',
        ports: [
          { label: 'start', input: false, tag: 'START' },
          { label: 'end', input: true, tag: 'END', value: 'END' },
        ],
      },
    ];

    state = LayoutReducer.selectPortForLink(state, 'PANDA-end', false);

    expect(state.layoutState.startPortForLink).toEqual('PANDA-start');
    expect(state.layoutState.endPortForLink).toEqual('PANDA-end');
    expect(state.layout.blocks[0].ports[1].value).toEqual('START');
  });

  it('isRelevantAttribute returns true if inport, icon or flowgraph', () => {
    const attribute = {};
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeFalsy();
    attribute.raw = {};
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeFalsy();
    attribute.raw.meta = {};
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeFalsy();
    attribute.raw.meta.tags = [];
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeFalsy();

    attribute.raw.meta.tags = ['inport:ZERO'];
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeTruthy();

    attribute.raw.meta.tags = ['widget:icon'];
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeTruthy();

    attribute.raw.meta.tags = ['widget:icon'];
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeTruthy();

    attribute.raw.meta.tags = ['something else', 'widget:icon'];
    expect(LayoutReducer.isRelevantAttribute(attribute)).toBeTruthy();
  });
});

const buildBlock = (index, numInputs, numOutputs) => ({
  name: `block ${index}`,
  description: `description ${index}`,
  mri: `block${index}`,
  icon: `icon${index}`,
  loading: false,
  ports: [
    ...[...Array(numInputs).keys()].map(v => ({
      label: `in${v + 1}`,
      input: true,
    })),
    ...[...Array(numOutputs).keys()].map(v => ({
      label: `out${v + 1}`,
      input: false,
    })),
  ],
  position: {
    x: 10,
    y: 20,
  },
});

describe('LayoutBuilder', () => {
  it('builds nodes correctly', () => {
    const blocks = [buildBlock(1, 1, 0)];

    const engine = LayoutReducer.buildLayoutEngine({ blocks }, []);
    expect(Object.keys(engine.diagramModel.nodes)).toEqual(['block1']);
    expect(engine.diagramModel.nodes.block1.label).toEqual('block 1');
    expect(engine.diagramModel.nodes.block1.description).toEqual(
      'description 1'
    );
    expect(engine.diagramModel.nodes.block1.id).toEqual('block1');
    expect(engine.diagramModel.nodes.block1.selected).toBeFalsy();
    expect(engine.diagramModel.nodes.block1.icon).toEqual('icon1');

    expect(Object.keys(engine.diagramModel.nodes.block1.ports)).toEqual([
      'block1-in1',
    ]);
    expect(engine.diagramModel.nodes.block1.ports['block1-in1'].label).toEqual(
      'in1'
    );
    expect(
      engine.diagramModel.nodes.block1.ports['block1-in1'].in
    ).toBeTruthy();
  });

  it('builds links correctly', () => {
    const blocks = [buildBlock(1, 0, 1), buildBlock(2, 1, 0)];

    blocks[1].ports[0].tag = 'ZERO';
    blocks[1].ports[0].value = 'block2';

    blocks[0].ports[0].tag = 'block2';
    blocks[0].ports[0].value = true;

    const engine = LayoutReducer.buildLayoutEngine({ blocks }, []);
    expect(Object.keys(engine.diagramModel.links)).toEqual([
      'block1-out1-block2-in1',
    ]);
    expect(
      engine.diagramModel.links['block1-out1-block2-in1'].sourcePort.id
    ).toEqual('block1-out1');
    expect(
      engine.diagramModel.links['block1-out1-block2-in1'].targetPort.id
    ).toEqual('block2-in1');
  });
});