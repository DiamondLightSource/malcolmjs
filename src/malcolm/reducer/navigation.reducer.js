import NavTypes from '../NavTypes';
import blockUtils from '../blockUtils';

export const processNavigationLists = (paths, blocks) => {
  const navigationLists = paths.map(p => ({
    path: p,
    children: [],
    basePath: '/',
    label: p,
    navType: undefined,
  }));

  const rootNav = {
    path: '',
    children: [],
  };

  if (blocks['.blocks']) {
    rootNav.children = blocks['.blocks'].children;
    rootNav.childrenLabels = blocks['.blocks'].children;
  }

  let basePath = '/';
  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    basePath = `${basePath + path}/`;
    navigationLists[i].basePath = basePath;
  }

  return {
    navigationLists,
    rootNav,
  };
};

function updateNavigationPath(state, payload) {
  return {
    ...state,
    navigation: processNavigationLists(payload.blockPaths, state.blocks),
    parentBlock: undefined,
    childBlock: undefined,
    mainAttribute: undefined,
  };
}

const isBlockMri = (navPath, blocks) =>
  blocks['.blocks'] &&
  blocks['.blocks'].children.findIndex(block => block === navPath) > -1;

const previousNavIsBlock = (i, navigationLists, blocks) =>
  i > 0 &&
  navigationLists[i - 1].navType === NavTypes.Block &&
  blocks[navigationLists[i - 1].blockMri];

const previousNavIsAttribute = (i, navigationLists) =>
  i > 1 && navigationLists[i - 1].navType === NavTypes.Attribute;

const updateBlockChildren = (nav, blocks) => {
  const updatedNav = nav;
  if (blocks[nav.blockMri]) {
    updatedNav.children = blocks[nav.blockMri].children;
    updatedNav.childrenLabels = updatedNav.children.map(child => {
      const attribute = blocks[nav.blockMri].attributes.find(
        a => a.calculated.name === child
      );
      return attribute && attribute.raw.meta ? attribute.raw.meta.label : child;
    });
  }
};

function updateNavTypes(state) {
  let updatedState = state;
  let { navigationLists } = updatedState.navigation;

  if (navigationLists.filter(nav => nav.navType === undefined).length > 0) {
    updatedState = { ...state };

    ({ navigationLists } = updatedState.navigation);
    const navIndices = navigationLists.map((nav, index) => index);
    navIndices
      .filter(navIndex => navigationLists[navIndex].navType === undefined)
      .forEach((originalIndex, i) => {
        const nav = navigationLists[originalIndex];
        if (nav.path === '.info') {
          nav.navType = NavTypes.Info;
          nav.label = 'Info';
        } else if (nav.path === '.palette') {
          nav.navType = NavTypes.Palette;
          nav.label = 'Palette';
        } else if (originalIndex === 0 && isBlockMri(nav.path, state.blocks)) {
          nav.navType = NavTypes.Block;
          nav.blockMri = nav.path;
          nav.label = nav.path;
        } else if (previousNavIsBlock(i, navigationLists, state.blocks)) {
          const matchingAttribute = blockUtils.findAttribute(
            state.blocks,
            navigationLists[i - 1].blockMri,
            nav.path.split('.')[0]
          );

          if (matchingAttribute) {
            nav.navType = NavTypes.Attribute;
            nav.children = matchingAttribute.calculated.children;
            nav.childrenLabels = matchingAttribute.calculated.children;
            nav.label = matchingAttribute.raw.meta
              ? matchingAttribute.raw.meta.label
              : nav.path;

            nav.subElement =
              nav.path.split('.').length > 1 &&
              (blockUtils.attributeHasTag(matchingAttribute, 'widget:table') ||
                matchingAttribute.raw.typeid === 'malcolm:core/Method:1.0')
                ? nav.path.split('.').slice(1)
                : undefined;
            [nav.path] = nav.path.split('.');
          }
        } else if (previousNavIsAttribute(i, navigationLists)) {
          const matchingAttribute = blockUtils.findAttribute(
            state.blocks,
            navigationLists[i - 2].blockMri,
            navigationLists[i - 1].path.split('.')[0]
          );
          if (matchingAttribute) {
            if (
              blockUtils.attributeHasTag(matchingAttribute, 'widget:flowgraph')
            ) {
              const nameIndex = matchingAttribute.raw.value.name.findIndex(
                n => n === nav.path
              );
              if (nameIndex > -1) {
                nav.navType = NavTypes.Block;
                nav.blockMri = matchingAttribute.raw.value.mri[nameIndex];
                nav.label = nav.path;
              }
            }
          }
        }
      });
  }

  navigationLists.forEach(nav => {
    if (nav.navType === NavTypes.Block) {
      updateBlockChildren(nav, state.blocks);
    }
  });

  // find parentBlock
  const details = navigationLists.filter(
    nav =>
      nav.navType === NavTypes.Block ||
      nav.navType === NavTypes.Info ||
      nav.navType === NavTypes.Palette
  );
  if (details.length === 1) {
    updatedState.parentBlock = details[0].path;
  } else if (details.length > 1) {
    // if there is something after the last block/info then it must become the parent
    if (
      details[details.length - 1] ===
      navigationLists[navigationLists.length - 1]
    ) {
      updatedState.parentBlock = details[details.length - 2].blockMri;
      const lastDetails = details[details.length - 1];
      updatedState.childBlock =
        lastDetails.navType === NavTypes.Block
          ? lastDetails.blockMri
          : lastDetails.path;
    } else {
      updatedState.parentBlock = details[details.length - 1].blockMri;
    }
  }

  // find attributes
  const attributes = navigationLists.filter(
    nav => nav.navType === NavTypes.Attribute
  );
  if (attributes.length > 0) {
    const lastAttribute = attributes[attributes.length - 1];
    const indexOfLastAttribute = navigationLists.findIndex(
      nav => nav === lastAttribute
    );
    const panelIndices = navigationLists
      .filter(nav => [NavTypes.Info, NavTypes.Block].includes(nav.navType))
      .map((nav, index) => index);

    if (indexOfLastAttribute >= panelIndices.slice(-2)[0]) {
      [updatedState.mainAttribute] = lastAttribute.path.split('.');
    }
  }
  return updatedState;
}

export default {
  updateNavigationPath,
  updateNavTypes,
};
