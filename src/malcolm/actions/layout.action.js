import {
  MalcolmSelectPortType,
  MalcolmMakeBlockVisibleType,
  MalcolmShowBinType,
  MalcolmInLayoutDeleteZoneType,
  MalcolmResetPortsType,
} from '../malcolm.types';
import {
  malcolmPutAction,
  malcolmSetFlag,
  malcolmSelectBlock,
} from '../malcolmActionCreators';
import blockUtils from '../blockUtils';
import { snackbarState } from '../../viewState/viewState.actions';
import { idSeparator } from '../../layout/layout.component';

const findPort = (blocks, id) => {
  const path = id.split(idSeparator);
  const block = blocks.find(b => b.mri === path[0]);
  const port = block.ports.find(p => p.label === path[1]);

  return port;
};

const selectPortInClient = (portId, start) => ({
  type: MalcolmSelectPortType,
  payload: {
    portId,
    start,
  },
});

export const selectPort = (portId, start) => (dispatch, getState) => {
  const port = findPort(getState().malcolm.layout.blocks, portId);

  if (port && port.input && port.value !== port.tag) {
    // Reset the ports
    dispatch({
      type: MalcolmResetPortsType,
      payload: {},
    });

    // Display an error message
    dispatch(
      snackbarState(
        true,
        `Error: Existing link to input port ${
          port.label
        }, delete existing link first.`
      )
    );
  } else {
    dispatch(selectPortInClient(portId, start));

    const { layoutState, layout } = getState().malcolm;
    const { startPortForLink, endPortForLink } = layoutState;

    if (startPortForLink && endPortForLink) {
      const startPort = findPort(layout.blocks, startPortForLink);
      const endPort = findPort(layout.blocks, endPortForLink);

      const outputPort = startPort.input ? endPort : startPort;

      // 2. update on the server
      const path = [
        ...(startPort.input ? startPortForLink : endPortForLink).split(
          idSeparator
        ),
        'value',
      ];

      dispatch(malcolmSetFlag(path, 'pending', true));
      dispatch(malcolmPutAction(path, outputPort.tag));
    }
  }
};

const makeBlockVisible = (mri, position, visible = true) => (
  dispatch,
  getState
) => {
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
      visible,
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
      visible: [visible],
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

const deleteBlocks = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { selectedBlocks } = state.layoutState;

  selectedBlocks.forEach(b => {
    makeBlockVisible(b, state.layoutState.layoutCenter, false)(
      dispatch,
      getState
    );
    dispatch(malcolmSelectBlock(b, false));
  });
};

const showLayoutBin = show => ({
  type: MalcolmShowBinType,
  payload: {
    visible: show,
  },
});

const mouseInsideDeleteZone = insideZone => ({
  type: MalcolmInLayoutDeleteZoneType,
  payload: {
    insideZone,
  },
});

export default {
  selectPort,
  makeBlockVisible,
  showLayoutBin,
  mouseInsideDeleteZone,
  deleteBlocks,
};
