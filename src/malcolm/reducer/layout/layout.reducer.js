import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import createReducer from '../createReducer';
import blockUtils from '../../blockUtils';
import {
  MalcolmMakeBlockVisibleType,
  MalcolmShowBinType,
  MalcolmInLayoutDeleteZoneType,
  MalcolmResetPortsType,
} from '../../malcolm.types';
import BlockNodeFactory from '../../../layout/block/BlockNodeFactory';
import BlockNodeModel from '../../../layout/block/BlockNodeModel';
import MalcolmLinkFactory from '../../../layout/link/link.factory';
import { sinkPort, sourcePort } from '../../malcolmConstants';
import { idSeparator } from '../../../layout/layout.component';

export const buildPorts = block => {
  const inputs = blockUtils.findAttributesWithTag(block, sinkPort);
  const outputs = blockUtils.findAttributesWithTag(block, sourcePort);

  return [
    ...inputs.map(input => ({
      label: input.calculated.name,
      input: true,
      tag: input.raw.meta.tags
        .find(t => t.indexOf(sinkPort) > -1)
        .split(':')
        .slice(-1)[0],
      portType: input.raw.meta.tags
        .find(t => t.indexOf(sinkPort) > -1)
        .split(':')[1],
      value: input.raw.value,
    })),
    ...outputs.map(output => ({
      label: output.calculated.name,
      input: false,
      tag: output.raw.meta.tags
        .find(t => t.indexOf(sourcePort) > -1)
        .split(':')
        .slice(-1)[0],
      portType: output.raw.meta.tags
        .find(t => t.indexOf(sourcePort) > -1)
        .split(':')[1],
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
      updatedBlock.icon = iconAttribute[0].raw.value;
    }

    updatedBlock.ports = buildPorts(matchingBlock);

    updatedBlock.loading =
      matchingBlock.loading ||
      (matchingBlock.attributes &&
        matchingBlock.attributes.some(a => a.calculated.loading));

    return updatedBlock;
  }

  return layoutBlock;
};

const findHiddenLinks = layoutBlocks =>
  layoutBlocks.map(block => {
    const updatedBlock = block;
    const connectedInputPorts = updatedBlock.ports.filter(
      p => p.input && p.value !== p.tag
    );

    connectedInputPorts.forEach(port => {
      const updatedPort = port;
      const isOutputPortVisible = layoutBlocks.some(b =>
        b.ports.some(p => p.tag === updatedPort.value)
      );
      updatedPort.hiddenLink = !isOutputPortVisible;
    });

    return updatedBlock;
  });

const processLayout = malcolmState => {
  const layout = {
    blocks: [],
  };

  const parentBlock = malcolmState.blocks[malcolmState.parentBlock];
  if (parentBlock && parentBlock.attributes) {
    const attribute = malcolmState.blocks[
      malcolmState.parentBlock
    ].attributes.find(
      a => a.calculated && a.calculated.name === malcolmState.mainAttribute
    );

    if (attribute && attribute.calculated.layout) {
      let layoutBlocks = attribute.calculated.layout.blocks
        .filter(b => b.visible)
        .map(b => offSetPosition(b, malcolmState.layoutState.layoutCenter))
        .map(b => updateLayoutBlock(b, malcolmState));

      layoutBlocks = findHiddenLinks(layoutBlocks);
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
    ].attributes.find(
      a => a.calculated && a.calculated.name === malcolmState.mainAttribute
    );

    if (attribute && attribute.calculated && attribute.calculated.layout) {
      const layoutBlocks = attribute.calculated.layout.blocks.map(
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

      attribute.calculated.layout.blocks = layoutBlocks;
    }
  }
};

const selectBlock = (malcolmState, blockName, isSelected) => {
  const { selectedBlocks } = malcolmState.layoutState;

  let updatedBlocks = selectedBlocks;
  if (isSelected && !selectedBlocks.find(b => b === blockName)) {
    updatedBlocks = [...selectedBlocks, blockName];
  } else if (!isSelected) {
    updatedBlocks = selectedBlocks.filter(b => b !== blockName);
  }

  return {
    ...malcolmState.layoutState,
    selectedBlocks: updatedBlocks,
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
  const path = id.split(idSeparator);
  const block = blocks.find(b => b.mri === path[0]);
  const port = block.ports.find(p => p.label === path[1]);

  return port;
};

const selectPortForLink = (malcolmState, portId, start) => {
  let { startPortForLink, endPortForLink } = malcolmState.layoutState;

  if (startPortForLink && endPortForLink) {
    // Reset
    startPortForLink = undefined;
  }

  startPortForLink = start ? portId : startPortForLink;
  endPortForLink = !start ? portId : undefined;

  const { layout } = malcolmState;

  if (startPortForLink && endPortForLink) {
    layout.blocks = [...layout.blocks];
    const startPort = findPort(layout.blocks, startPortForLink);
    const endPort = findPort(layout.blocks, endPortForLink);

    // if both ports are inputs or both outputs then don't make the connection
    if (startPort.input === endPort.input) {
      return malcolmState;
    }

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

const makeBlockVisible = (state, payload) => {
  const updatedState = state;
  const parentBlock = state.blocks[state.parentBlock];
  if (parentBlock && parentBlock.attributes) {
    const attribute = state.blocks[state.parentBlock].attributes.find(
      a => a.calculated && a.calculated.name === state.mainAttribute
    );

    if (attribute && attribute.calculated && attribute.calculated.layout) {
      const layoutBlocks = [...attribute.calculated.layout.blocks];
      const matchingLayoutBlock = layoutBlocks.find(b => b.mri === payload.mri);

      if (matchingLayoutBlock) {
        matchingLayoutBlock.visible = payload.visible;
        matchingLayoutBlock.position = payload.position;
      } else {
        layoutBlocks.push({
          name: payload.mri,
          mri: payload.mri,
          visible: payload.visible,
          position: payload.position,
        });
      }

      attribute.calculated.layout.blocks = layoutBlocks;
      updatedState.layout = processLayout(state);
    }
  }

  return updatedState;
};

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

const buildLayoutEngine = (layout, selectedBlocks, layoutEngineView) => {
  const engine = new DiagramEngine();
  engine.installDefaultFactories();
  engine.registerNodeFactory(new BlockNodeFactory());
  engine.registerLinkFactory(new MalcolmLinkFactory());

  const model = new DiagramModel();

  engine.portMouseDown = () => {};
  engine.clickHandler = () => {};
  engine.mouseDownHandler = () => {};

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

  engine.setDiagramModel(model);

  if (layoutEngineView) {
    engine.diagramModel.offsetX = layoutEngineView.offset.x;
    engine.diagramModel.offsetY = layoutEngineView.offset.y;
    engine.diagramModel.zoom = layoutEngineView.zoom;
  }

  return engine;
};

const showLayoutBin = (state, payload) => {
  const layoutState = { ...state.layoutState };
  layoutState.showBin = payload.visible;

  return {
    ...state,
    layoutState,
  };
};

const cursorInLayoutZone = (state, payload) => {
  const layoutState = { ...state.layoutState };
  layoutState.inDeleteZone = payload.insideZone;

  return {
    ...state,
    layoutState,
  };
};

const isRelevantAttribute = attribute =>
  attribute &&
  attribute.raw &&
  attribute.raw.meta &&
  attribute.raw.meta.tags &&
  (attribute.raw.meta.tags.some(t => t.indexOf(sinkPort) > -1) ||
    attribute.raw.meta.tags.some(t => t.indexOf('widget:icon') > -1) ||
    attribute.raw.meta.tags.some(t => t.indexOf('widget:flowgraph') > -1));

const resetPorts = state => {
  let updatedState = selectPortForLink(state, undefined, true);
  updatedState = selectPortForLink(updatedState, undefined, false);

  const layoutEngineView = updatedState.layoutEngine
    ? {
        offset: {
          x: updatedState.layoutEngine.diagramModel.offsetX,
          y: updatedState.layoutEngine.diagramModel.offsetY,
        },
        zoom: updatedState.layoutEngine.diagramModel.zoom,
      }
    : undefined;

  updatedState = showLayoutBin(updatedState, { visible: false });
  const layoutEngine = buildLayoutEngine(
    updatedState.layout,
    updatedState.layoutState.selectedBlocks,
    layoutEngineView
  );
  return {
    ...updatedState,
    layoutEngine,
  };
};

export const LayoutReduxReducer = createReducer(
  {},
  {
    [MalcolmMakeBlockVisibleType]: makeBlockVisible,
    [MalcolmShowBinType]: showLayoutBin,
    [MalcolmInLayoutDeleteZoneType]: cursorInLayoutZone,
    [MalcolmResetPortsType]: resetPorts,
  }
);

export default {
  processLayout,
  updateBlockPosition,
  selectBlock,
  shiftIsPressed,
  selectPortForLink,
  buildLayoutEngine,
  isRelevantAttribute,
};
