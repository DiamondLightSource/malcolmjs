import { replace, push } from 'react-router-redux';
import NavTypes from '../NavTypes';
import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';
import blockUtils from '../blockUtils';

const findBlockIndex = (navList, blockMri) => {
  const navLength = navList.length;
  const navListTrim =
    navLength && !(navLength % 2) ? navList.slice(-2) : navList.slice(-3);
  const index = navListTrim.findIndex(
    nav => nav.navType === NavTypes.Block && nav.blockMri === blockMri
  );
  return index !== -1 ? navLength - navListTrim.length + index : -1;
};

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

  const attribute = blockUtils.findAttribute(
    state.blocks,
    blockMri,
    attributeName
  );

  // subscribe to layout blocks
  if (blockUtils.attributeHasTag(attribute, 'widget:flowgraph')) {
    attribute.raw.value.visible.forEach((visible, i) => {
      if (visible) {
        const blockName = attribute.raw.value.mri[i];
        if (!state.blocks[blockName]) {
          dispatch(malcolmNewBlockAction(blockName, false, false));
          dispatch(malcolmSubscribeAction([blockName, 'meta']));
        }
      }
    });
  }

  const { navigationLists } = state.navigation;
  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);
  if (matchingBlockNav > -1) {
    const newPath = `/gui/${navigationLists
      .filter((nav, i) => i <= matchingBlockNav)
      .map(nav => nav.path)
      .join('/')}/${attributeName}`;
    dispatch(push(newPath));
  }
};

const navigateToInfo = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);
  if (matchingBlockNav > -1) {
    if (subElement !== undefined) {
      const newPath = `/gui/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}.${subElement}/.info`;
      dispatch(push(newPath));
    } else {
      const newPath = `/gui/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}/.info`;
      dispatch(push(newPath));
    }
  }
};

const navigateToSubElement = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);

  if (matchingBlockNav > -1) {
    if (subElement) {
      const newPath = `/gui/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}.${subElement}/${navigationLists
        .filter(
          (nav, i) => i > matchingBlockNav + 1 && nav.navType === NavTypes.Info
        )
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(replace(newPath));
    } else {
      const newPath = `/gui/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}/${navigationLists
        .filter((nav, i) => i > matchingBlockNav + 1)
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(replace(newPath));
    }
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
    if (navigationLists.slice(-1)[0].navType === NavTypes.Info) {
      const { blockMri } = navigationLists.slice(-3)[0];
      const attributeName = state.mainAttribute;
      const { subElements } = navigationLists.slice(-2)[0];
      const { blocks } = getState().malcolm;
      const attribute = blockUtils.findAttribute(
        blocks,
        blockMri,
        attributeName
      );
      if (attribute && attribute.calculated && attribute.calculated.isMethod) {
        const newPath = `/gui/${navigationLists
          .slice(0, -2)
          .map(nav => nav.path)
          .join('/')}/${state.mainAttribute}${
          subElements ? `.${subElements.join('.')}` : ''
        }`;
        dispatch(push(newPath));
      } else {
        const newPath = `/gui/${navigationLists
          .slice(0, -1)
          .map(nav => nav.path)
          .join('/')}`;
        dispatch(push(newPath));
      }
    } else {
      const newPath = `/gui/${navigationLists
        .slice(0, -1)
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(push(newPath));
    }
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

const updateChildPanelWithLink = (blockMri, portName) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    state.parentBlock,
    state.mainAttribute
  );
  const blockIndex = layoutAttribute.raw.value.mri.findIndex(
    mri => mri === blockMri
  );
  const blockName =
    blockIndex > -1 ? layoutAttribute.raw.value.name[blockIndex] : blockMri;
  const newChild = `${blockName}.${portName}.link`;

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

const closeInfo = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const { blocks, navigationLists, mainAttribute } = getState().malcolm;
  const attribute = blockUtils.findAttribute(blocks, blockMri, attributeName);
  if (attribute && attribute.calculated && attribute.calculated.isMethod) {
    const newPath = `/gui/${navigationLists
      .slice(0, -2)
      .map(nav => nav.path)
      .join('/')}/${mainAttribute}${subElement ? `.${subElement}` : ''}`;
    dispatch(push(newPath));
  } else {
    const newPath = `/gui/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}`;
    dispatch(push(newPath));
  }
};

export default {
  subscribeToNewBlocksInRoute,
  navigateToAttribute,
  navigateToInfo,
  navigateToSubElement,
  navigateToPalette,
  updateChildPanel,
  closeChildPanel,
  updateChildPanelWithLink,
  closeInfo,
};
