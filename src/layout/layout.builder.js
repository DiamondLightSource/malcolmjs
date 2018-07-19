import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import BlockNodeFactory from './block/BlockNodeFactory';
import BlockNodeModel from './block/BlockNodeModel';
import MalcolmLinkFactory from './link/link.factory';

const buildBlockNode = (block, selectedBlocks, clickHandler, portMouseDown) => {
  const node = new BlockNodeModel(block.name, block.description, block.mri);
  block.ports.forEach(p => node.addBlockPort(p, portMouseDown));
  node.addIcon(block.icon);
  node.setPosition(block.position.x, block.position.y);
  node.addClickHandler(clickHandler);
  node.selected = selectedBlocks.some(b => b === block.mri);

  return node;
};

export const buildDiagramEngine = (
  blocks,
  selectedBlocks,
  clickHandler,
  portMouseDown,
  selectedHandler
) => {
  const engine = new DiagramEngine();
  engine.installDefaultFactories();
  engine.registerNodeFactory(new BlockNodeFactory());
  engine.registerLinkFactory(new MalcolmLinkFactory());

  const model = new DiagramModel();

  const nodes = blocks.map(b =>
    buildBlockNode(
      b,
      selectedBlocks,
      node => clickHandler(b, node),
      portMouseDown
    )
  );

  const links = [];
  blocks.forEach(b => {
    const linkStarts = b.ports.filter(p => p.input && p.tag !== p.value);

    const startNode = nodes.find(n => n.id === b.mri);
    linkStarts.forEach(start => {
      const startPort = startNode.ports[`${b.mri}-${start.label}`];

      if (startPort !== undefined) {
        // need to find the target port and link them together
        const targetPortValue = start.value;
        const endBlock = blocks.find(block =>
          block.ports.some(p => !p.input && p.tag === targetPortValue)
        );

        if (endBlock) {
          const end = endBlock.ports.find(
            p => !p.input && p.tag === targetPortValue
          );

          const endNode = nodes.find(n => n.id === endBlock.mri);
          const endPort = endNode.ports[`${endBlock.mri}-${end.label}`];

          const newLink = endPort.link(startPort);
          newLink.id = `${endPort.name}-${startPort.name}`;
          links.push(newLink);
        }
      }
    });
  });

  const models = model.addAll(...nodes, ...links);
  // add a selection listener to each
  models.forEach(item => {
    item.addListener({
      selectionChanged: e => {
        selectedHandler(e.entity.type, e.entity.id, e.isSelected);
      },
    });
  });

  engine.setDiagramModel(model);

  return engine;
};

export default {
  buildDiagramEngine,
};
