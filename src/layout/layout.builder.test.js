import { buildDiagramEngine } from './layout.builder';

const buildBlock = (index, numInputs, numOutputs) => ({
  name: `block ${index}`,
  description: `description ${index}`,
  mri: `block${index}`,
  icon: `icon${index}`,
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

    const engine = buildDiagramEngine(blocks, [], 'url', () => {});
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

    const engine = buildDiagramEngine(blocks, [], 'url', () => {});
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
