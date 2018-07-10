import { push } from 'react-router-redux';
import NavTypes from '../NavTypes';
import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';

const subscribeToNewBlocksInRoute = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;
  const { blocks } = state;

  const blocksInRoute = navigationLists.filter(
    nav => nav.navType === NavTypes.Block
  );
  const unsubscribedBlocks = blocksInRoute.filter(nav => !blocks[nav.blockMri]);

  unsubscribedBlocks.forEach(nav => {
    dispatch(malcolmNewBlockAction(nav.blockMri, false, false));
    dispatch(malcolmSubscribeAction([nav.blockMri, 'meta']));
  });
};

const navigateToAttribute = (blockMri, attributeName) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const matchingBlockNav = navigationLists.findIndex(
    nav => nav.navType === NavTypes.Block && nav.blockMri === blockMri
  );
  if (matchingBlockNav > -1) {
    const newPath = `/gui/${navigationLists
      .filter((nav, i) => i <= matchingBlockNav)
      .map(nav => nav.path)
      .join('/')}/${attributeName}`;
    dispatch(push(newPath));
  }
};

export default {
  subscribeToNewBlocksInRoute,
  navigateToAttribute,
};
