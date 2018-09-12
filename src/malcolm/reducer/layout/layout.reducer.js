import createReducer from '../createReducer';
import blockUtils from '../../blockUtils';
import {
  MalcolmMakeBlockVisibleType,
  MalcolmShowBinType,
  MalcolmInLayoutDeleteZoneType,
  MalcolmResetPortsType,
} from '../../malcolm.types';
import { sinkPort, sourcePort } from '../../malcolmConstants';
import { buildLayoutEngine } from './layoutEngine.helper';
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

const updateLayoutAndEngine = (state, updateLayout = true) => {
  const layout = updateLayout ? processLayout(state) : state.layout;

  const layoutEngineView = state.layoutEngine
    ? {
        offset: {
          x: state.layoutEngine.diagramModel.offsetX,
          y: state.layoutEngine.diagramModel.offsetY,
        },
        zoom: state.layoutEngine.diagramModel.zoom,
      }
    : undefined;

  const layoutEngine = buildLayoutEngine(
    layout,
    state.layoutState.selectedBlocks,
    layoutEngineView
  );

  return {
    layout,
    layoutEngine,
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
      const layoutUpdates = updateLayoutAndEngine(updatedState);
      updatedState.layout = layoutUpdates.layout;
      updatedState.layoutEngine = layoutUpdates.layoutEngine;
    }
  }

  return updatedState;
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

const isRelevantWidget = attribute => {
  if (!attribute.raw || !attribute.raw.meta) {
    return false;
  }

  const { tags } = attribute.raw.meta;
  return (
    tags &&
    (tags.some(t => t.indexOf(sinkPort) > -1) ||
      tags.some(t => t.indexOf('widget:icon') > -1) ||
      tags.some(t => t.indexOf('widget:flowgraph') > -1))
  );
};

const isLabelAttribute = attribute =>
  attribute.calculated && attribute.calculated.name === 'label';

const isRelevantAttribute = attribute =>
  attribute && (isRelevantWidget(attribute) || isLabelAttribute(attribute));

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
  updateLayoutAndEngine,
  updateBlockPosition,
  selectBlock,
  shiftIsPressed,
  selectPortForLink,
  isRelevantAttribute,
};
