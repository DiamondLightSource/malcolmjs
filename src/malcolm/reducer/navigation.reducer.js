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
        } else if (nav.path.endsWith('.link')) {
          nav.navType = NavTypes.Info;
          nav.label = nav.path.replace(/\./g, ' ');
          const linkParts = nav.path.split('.');
          [nav.linkInputBlock, nav.linkInputPort] = linkParts;
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

          if (matchingAttribute && !matchingAttribute.calculated.loading) {
            nav.navType = NavTypes.Attribute;
            nav.children = matchingAttribute.calculated.children;
            nav.childrenLabels = matchingAttribute.calculated.children;
            if (nav.path.split('.').length > 1) {
              const subElements = nav.path.split('.').slice(1);
              if (
                blockUtils.validateAttributeSubElement(
                  matchingAttribute,
                  subElements
                )
              ) {
                nav.subElements = subElements;
              } else {
                nav.subElements = undefined;
                nav.navType = NavTypes.Error;
                throw new Error('Bad URL (field has no such sub-element)!');
              }
            }
            [nav.path] = nav.path.split('.');
            nav.label = nav.path;
            if (matchingAttribute.raw) {
              if (matchingAttribute.raw.meta) {
                nav.label = matchingAttribute.raw.meta.label;
              } else if (matchingAttribute.raw.label) {
                nav.label = matchingAttribute.raw.label;
              }
            }
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

  // find main attribute
  updatedState.mainAttribute = undefined;
  let mainAttributeNav;
  if (navigationLists.length !== 1) {
    const isOdd = !!(navigationLists.length % 2);
    const lastTwoNavs = navigationLists.slice(-2);
    if (isOdd && lastTwoNavs[0].navType === NavTypes.Attribute) {
      [mainAttributeNav] = lastTwoNavs;
    } else if (!isOdd && lastTwoNavs[1].navType === NavTypes.Attribute) {
      [, mainAttributeNav] = lastTwoNavs;
    }
  }
  if (mainAttributeNav) {
    updatedState.mainAttributeSubElements = mainAttributeNav.subElements;
    [updatedState.mainAttribute] = mainAttributeNav.path.split('.');
  }

  /*
  const attributes = navigationLists.filter(
    nav => nav.navType === NavTypes.Attribute
  );
  if (attributes.length > 0) {
    const lastAttribute = attributes[attributes.length - 1];
    const indexOfLastAttribute = navigationLists.findIndex(
      nav => nav === lastAttribute
    );
    const panelIndices = navigationLists
      .map((nav, index) => index)
      .filter(navIndex =>
        [NavTypes.Info, NavTypes.Palette, NavTypes.Block].includes(
          navigationLists[navIndex].navType
        )
      );

    if (indexOfLastAttribute >= panelIndices.slice(-2)[0]) {
      [updatedState.mainAttribute] = lastAttribute.path.split('.');
    } else {
      updatedState.mainAttribute = undefined;
    }
  } */
  return updatedState;
}

export default {
  updateNavigationPath,
  updateNavTypes,
};
