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

const closeChildPanel = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;
  if (navigationLists.slice(-1)[0].navType === NavTypes.Block) {
    const newPath = `/gui/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}`;
    dispatch(push(newPath));
  }
};

const updateChildPanel = newChild => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  let newPath;
  if (navigationLists.slice(-1)[0].navType === NavTypes.Block) {
    newPath = `/gui/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  } else {
    newPath = `/gui/${navigationLists
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  }
  dispatch(push(newPath));
};

export default {
  subscribeToNewBlocksInRoute,
  navigateToAttribute,
  updateChildPanel,
  closeChildPanel,
};
