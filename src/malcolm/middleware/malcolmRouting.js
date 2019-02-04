import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';
import NavTypes from '../NavTypes';
import { rootBlockSubPath } from '../malcolmHandlers/blockMetaHandler';

const handleLocationChange = (path, blocks, dispatch, getState) => {
  // remove the first part of the url e.g. /gui/ or /details/
  const tokens = path
    .replace(/\/$/, '') // strip off the trailing /
    .split('/')
    .slice(2);
  dispatch(malcolmNavigationPath(tokens));

  // Get the root list of blocks
  if (!blocks['.blocks']) {
    dispatch(malcolmNewBlockAction('.blocks', false, false));
    dispatch(malcolmSubscribeAction(rootBlockSubPath, false));
  } else {
    const { navigationLists } = getState().malcolm.navigation;
    const newBlocks = navigationLists.filter(
      nav => nav.navType === NavTypes.Block && !blocks[nav.blockMri]
    );
    newBlocks.forEach(nav => {
      dispatch(malcolmNewBlockAction(nav.blockMri, false, false));
      dispatch(malcolmSubscribeAction([nav.blockMri, 'meta']));
    });
  }
};

export default handleLocationChange;
