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

const navigateToInfo = (blockMri, attributeName) => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const matchingBlockNav = navigationLists.findIndex(
    nav => nav.navType === NavTypes.Block && nav.blockMri === blockMri
  );
  if (matchingBlockNav > -1) {
    const newPath = `/gui/${navigationLists
      .filter((nav, i) => i <= matchingBlockNav)
      .map(nav => nav.path)
      .join('/')}/${attributeName}/.info`;
    dispatch(push(newPath));
  }
};

const navigateToPalette = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const lastAttributeNav = [...navigationLists]
    .reverse()
    .findIndex(nav => nav.navType === NavTypes.Attribute);
  if (lastAttributeNav > -1) {
    const newPath = `/gui/${navigationLists
      .filter((nav, i) => i <= navigationLists.length - 1 - lastAttributeNav)
      .map(nav => nav.path)
      .join('/')}/.palette`;
    dispatch(push(newPath));
  }
};

const isChildPanelNavType = navType =>
  navType === NavTypes.Block ||
  navType === NavTypes.Info ||
  navType === NavTypes.Palette;

const closeChildPanel = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;
  if (isChildPanelNavType(navigationLists.slice(-1)[0].navType)) {
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

  if (navigationLists.slice(-1)[0].path === newChild) {
    return; // nothing to do as the child panel is already newChild
  }

  let newPath;
  if (isChildPanelNavType(navigationLists.slice(-1)[0].navType)) {
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
  navigateToInfo,
  navigateToPalette,
  updateChildPanel,
  closeChildPanel,
};
