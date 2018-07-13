import {
  MalcolmSelectPortType,
  MalcolmMakeBlockVisibleType,
} from '../malcolm.types';
import { malcolmPutAction, malcolmSetFlag } from '../malcolmActionCreators';
import blockUtils from '../blockUtils';

const findPort = (blocks, id) => {
  const path = id.split('-');
  const block = blocks.find(b => b.mri === path[0]);
  const port = block.ports.find(p => p.label === path[1]);

  return port;
};

export const selectPort = (portId, start) => (dispatch, getState) => {
  dispatch({
    type: MalcolmSelectPortType,
    payload: {
      portId,
      start,
    },
  });

  const { layoutState, layout } = getState().malcolm;
  const { startPortForLink, endPortForLink } = layoutState;

  if (startPortForLink && endPortForLink) {
    const startPort = findPort(layout.blocks, startPortForLink);
    const endPort = findPort(layout.blocks, endPortForLink);

    const outputPort = startPort.input ? endPort : startPort;

    // 2. update on the server
    const path = [
      ...(startPort.input ? startPortForLink : endPortForLink).split('-'),
      'value',
    ];

    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, outputPort.tag));
  }
};

const makeBlockVisible = (mri, position) => (dispatch, getState) => {
  const state = getState().malcolm;
  const positionRelativeToCenter = {
    x: position.x - state.layoutState.layoutCenter.x,
    y: position.y - state.layoutState.layoutCenter.y,
  };

  dispatch({
    type: MalcolmMakeBlockVisibleType,
    payload: {
      mri,
      position: positionRelativeToCenter,
    },
  });

  const blockName = state.parentBlock;
  const attributeName = state.mainAttribute;
  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    attributeName
  );

  if (layoutAttribute) {
    const visibleBlockIndex = layoutAttribute.raw.value.mri.findIndex(
      val => val === mri
    );
    const updateLayout = {
      name: [layoutAttribute.raw.value.name[visibleBlockIndex]],
      visible: [true],
      mri: [mri],
      x: [positionRelativeToCenter.x],
      y: [positionRelativeToCenter.y],
    };

    dispatch(malcolmSetFlag([blockName, attributeName], 'pending', true));
    dispatch(
      malcolmPutAction([blockName, attributeName, 'value'], updateLayout)
    );
  }
};

export default {
  selectPort,
  makeBlockVisible,
};
