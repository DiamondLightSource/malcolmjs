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
import { sinkPort } from '../malcolmConstants';

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
  if (!portId) {
    if (getState().malcolm.layoutState.startPortForLink) {
      dispatch({
        type: MalcolmResetPortsType,
        payload: {},
      });
    }
    return;
  }

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

const makeBlockVisible = (mriList, positionList, visibleList) => (
  dispatch,
  getState
) => {
  let mri;
  let position;
  let visible;
  if (!(mriList instanceof Array)) {
    mri = [mriList];
    position = [positionList];
    visible = [visibleList === undefined ? true : visibleList];
  } else {
    mri = [...mriList];
    position = [...positionList];
    visible = [...visibleList];
  }

  const state = getState().malcolm;
  const positionRelativeToCenter = position.map(pos => ({
    x: pos.x - state.layoutState.layoutCenter.x,
    y: pos.y - state.layoutState.layoutCenter.y,
  }));

  mri.forEach((blockMri, index) => {
    dispatch({
      type: MalcolmMakeBlockVisibleType,
      payload: {
        mri: blockMri,
        position: positionRelativeToCenter[index],
        visible: visible[index],
      },
    });
  });

  const blockName = state.parentBlock;
  const attributeName = state.mainAttribute;
  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    attributeName
  );

  if (layoutAttribute && mri.length > 0) {
    const visibleBlockIndices = mri.map(blockMri =>
      layoutAttribute.raw.value.mri.findIndex(val => val === blockMri)
    );
    const updateLayout = {
      name: visibleBlockIndices.map(
        index => layoutAttribute.raw.value.name[index]
      ),
      visible,
      mri,
      x: positionRelativeToCenter.map(pos => pos.x),
      y: positionRelativeToCenter.map(pos => pos.y),
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

  makeBlockVisible(
    selectedBlocks,
    selectedBlocks.map(() => state.layoutState.layoutCenter),
    selectedBlocks.map(() => false)
  )(dispatch, getState);
  selectedBlocks.forEach(b => {
    dispatch(malcolmSelectBlock(b, false));
  });
};

const deleteLinks = () => (dispatch, getState) => {
  const state = getState().malcolm;

  state.layoutState.selectedLinks.forEach(linkId => {
    const [, , blockMri, linkAttr] = linkId.split(idSeparator);
    const portAttribute = blockUtils.findAttribute(
      state.blocks,
      blockMri,
      linkAttr
    );
    if (portAttribute) {
      const portNullValue = portAttribute.raw.meta.tags
        .find(t => t.indexOf(sinkPort) > -1)
        .split(':')
        .slice(-1)[0];
      dispatch(malcolmSetFlag([blockMri, linkAttr], 'pending', true));
      dispatch(malcolmPutAction([blockMri, linkAttr], portNullValue));
    }
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
  deleteLinks,
};
