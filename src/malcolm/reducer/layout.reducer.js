import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmMakeBlockVisibleType } from '../malcolm.types';
import BlockNodeFactory from '../../layout/block/BlockNodeFactory';
import BlockNodeModel from '../../layout/block/BlockNodeModel';
import MalcolmLinkFactory from '../../layout/link/link.factory';

export const buildPorts = block => {
  const inputs = blockUtils.findAttributesWithTag(block, 'inport:');
  const outputs = blockUtils.findAttributesWithTag(block, 'outport:');

  return [
    ...inputs.map(input => ({
      label: input.calculated.name,
      input: true,
      tag: input.raw.meta.tags
        .find(t => t.indexOf('inport:') > -1)
        .split(':')
        .slice(-1)[0],
      value: input.raw.value,
    })),
    ...outputs.map(output => ({
      label: output.calculated.name,
      input: false,
      tag: output.raw.meta.tags
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
      updatedBlock.icon = iconAttribute[0].raw.value;
    }

    updatedBlock.ports = buildPorts(matchingBlock);

    updatedBlock.loading =
      matchingBlock.loading ||
      matchingBlock.attributes.some(a => a.calculated.loading);

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
    ].attributes.find(
      a => a.calculated && a.calculated.name === malcolmState.mainAttribute
    );

    if (attribute && attribute.calculated.layout) {
      const layoutBlocks = attribute.calculated.layout.blocks
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
        matchingLayoutBlock.visible = true;
        matchingLayoutBlock.position = payload.position;
      } else {
        layoutBlocks.push({
          name: payload.mri,
          mri: payload.mri,
          visible: true,
          position: payload.position,
        });
      }

      attribute.calculated.layout.blocks = layoutBlocks;
      updatedState.layout = processLayout(state);
    }
  }

  return updatedState;
};

const buildBlockNode = (block, selectedBlocks, clickHandler, portMouseDown) => {
  const node = new BlockNodeModel(block.name, block.description, block.mri);
  block.ports.forEach(p => node.addBlockPort(p, portMouseDown));
  node.addIcon(block.icon);
  node.setPosition(block.position.x, block.position.y);
  node.addClickHandler(clickHandler);
  node.selected = selectedBlocks.some(b => b === block.mri);
  node.block = block;

  return node;
};

const buildLayoutEngine = (layout, selectedBlocks) => {
  const engine = new DiagramEngine();
  engine.installDefaultFactories();
  engine.registerNodeFactory(new BlockNodeFactory());
  engine.registerLinkFactory(new MalcolmLinkFactory());

  const model = new DiagramModel();

  engine.portMouseDown = () => {};
  engine.clickHandler = () => {};

  const nodes = layout.blocks.map(b =>
    buildBlockNode(
      b,
      selectedBlocks,
      node => engine.clickHandler(b, node),
      (portId, start) => engine.portMouseDown(portId, start)
    )
  );

  const links = [];
  layout.blocks.forEach(b => {
    const linkStarts = b.ports.filter(p => p.input && p.tag !== p.value);

    const startNode = nodes.find(n => n.id === b.mri);
    linkStarts.forEach(start => {
      const startPort = startNode.ports[`${b.mri}-${start.label}`];

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
          const endPort = endNode.ports[`${endBlock.mri}-${end.label}`];

          const newLink = endPort.link(startPort);
          newLink.id = `${endPort.name}-${startPort.name}`;
          links.push(newLink);
        }
      }
    });
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

  return engine;
};

export const LayoutReduxReducer = createReducer(
  {},
  {
    [MalcolmMakeBlockVisibleType]: makeBlockVisible,
  }
);

export default {
  processLayout,
  updateBlockPosition,
  selectBlock,
  shiftIsPressed,
  selectPortForLink,
  buildLayoutEngine,
};
