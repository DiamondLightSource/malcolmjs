import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import BlockNodeFactory from '../../../layout/block/BlockNodeFactory';
import BlockNodeModel from '../../../layout/block/BlockNodeModel';
import MalcolmLinkFactory from '../../../layout/link/link.factory';
import { idSeparator } from '../../../layout/layout.component';

const buildBlockNode = (
  block,
  selectedBlocks,
  clickHandler,
  mouseDownHandler,
  portMouseDown
) => {
  const node = new BlockNodeModel(block.name, block.description, block.mri);
  block.ports.forEach(p => node.addBlockPort(p, portMouseDown));
  node.addIcon(block.icon);
  node.setPosition(block.position.x, block.position.y);
  node.addClickHandler(clickHandler);
  node.addMouseDownHandler(mouseDownHandler);
  node.selected = selectedBlocks.some(b => b === block.mri);
  node.block = block;

  return node;
};

export const buildLayoutEngine = (
  layout,
  selectedBlocks,
  selectedLinks,
  layoutEngineView
) => {
  const engine = new DiagramEngine();
  engine.installDefaultFactories();
  engine.registerNodeFactory(new BlockNodeFactory());
  engine.registerLinkFactory(new MalcolmLinkFactory());

  const model = new DiagramModel();

  engine.portMouseDown = () => {};
  engine.clickHandler = () => {};
  engine.mouseDownHandler = () => {};
  engine.linkClickHandler = () => {};

  const nodes = layout.blocks
    .filter(b => b.loading === false)
    .map(b =>
      buildBlockNode(
        b,
        selectedBlocks,
        node => engine.clickHandler(b, node),
        show => engine.mouseDownHandler(show),
        (portId, start) => engine.portMouseDown(portId, start)
      )
    );

  const links = [];
  layout.blocks.forEach(b => {
    const linkStarts = b.ports.filter(p => p.input && p.tag !== p.value);

    const startNode = nodes.find(n => n.id === b.mri);
    if (startNode) {
      linkStarts.forEach(start => {
        const startPort =
          startNode.ports[`${b.mri}${idSeparator}${start.label}`];

        if (startPort !== undefined) {
          // need to find the target port and link them together
          const targetPortValue = start.value;
          const endBlock = layout.blocks.find(block =>
            block.ports.some(p => !p.input && p.tag === targetPortValue)
          );

          if (endBlock) {
            const end = endBlock.ports.find(
              p => !p.input && p.tag === targetPortValue
            );

            const endNode = nodes.find(n => n.id === endBlock.mri);

            if (endNode) {
              const endPort =
                endNode.ports[`${endBlock.mri}${idSeparator}${end.label}`];

              const newLink = endPort.link(startPort);
              newLink.id = `${endPort.name}${idSeparator}${startPort.name}`;
              newLink.selected = selectedLinks.some(
                linkId => linkId === newLink.id
              );
              newLink.clickHandler = linkId => {
                engine.linkClickHandler(linkId);
              };
              links.push(newLink);
            }
          }
        }
      });
    }
  });

  engine.selectedHandler = () => {};

  const models = model.addAll(...nodes, ...links);

  models.forEach(item => {
    item.addListener({
      selectionChanged: e => {
        engine.selectedHandler(e.entity.type, e.entity.id, e.isSelected);
      },
    });
  });

  if (layout.locked) {
    model.setLocked(true);
  }

  engine.setDiagramModel(model);

  if (layoutEngineView) {
    engine.diagramModel.offsetX = layoutEngineView.offset.x;
    engine.diagramModel.offsetY = layoutEngineView.offset.y;
    engine.diagramModel.zoom = layoutEngineView.zoom;
  }

  return engine;
};

export default {
  buildLayoutEngine,
};
