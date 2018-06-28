import { MalcolmSelectPortType } from '../malcolm.types';
import { malcolmPutAction, malcolmSetFlag } from '../malcolmActionCreators';

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

export default {
  selectPort,
};
