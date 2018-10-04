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
    basePath: '/',
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
  const { rootNav } = updatedState.navigation;

  if (navigationLists.filter(nav => nav.navType === undefined).length > 0) {
    updatedState = { ...state };

    ({ navigationLists } = updatedState.navigation);
    navigationLists.forEach((originalNav, i) => {
      const nav = originalNav;
      if (nav.navType === undefined) {
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
        } else if (i === 0 && isBlockMri(nav.path, state.blocks)) {
          nav.navType = NavTypes.Block;
          nav.blockMri = nav.path;
          nav.label = nav.path;
          nav.parent = rootNav;
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
            const rawPath = nav.path.split('.');
            [nav.path] = nav.path.split('.');
            nav.label = nav.path;
            if (matchingAttribute.raw) {
              if (matchingAttribute.raw.meta) {
                nav.label = matchingAttribute.raw.meta.label;
              } else if (matchingAttribute.raw.label) {
                nav.label = matchingAttribute.raw.label;
              }
            }
            if (rawPath.length > 1) {
              const subElements = rawPath.slice(1);
              if (
                blockUtils.validateAttributeSubElement(
                  matchingAttribute,
                  subElements
                )
              ) {
                nav.subElements = subElements;
              } else {
                nav.subElements = [undefined];
                nav.badUrlPart = subElements;
                nav.label = [nav.label, ...subElements].join('.');
                if (
                  navigationLists[i + 1] &&
                  navigationLists[i + 1].path !== '.info'
                ) {
                  navigationLists.slice(i + 1).forEach(navElement => {
                    const erroredNav = navElement;
                    erroredNav.navType = NavTypes.Error;
                  });
                }
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
            if (
              nav.navType === undefined &&
              !matchingAttribute.calculated.loading
            ) {
              navigationLists.slice(i).forEach(navElement => {
                const erroredNav = navElement;
                erroredNav.navType = NavTypes.Error;
              });
            }
          }
        }
        if (navigationLists[i - 1]) {
          nav.parent = navigationLists[i - 1];
          if (
            navigationLists[i - 1].children &&
            navigationLists[i - 1].children.length > 0
          ) {
            // nav.siblings = navigationLists[i - 1].children;
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
  const validNavList = navigationLists.filter(
    nav => nav.navType !== NavTypes.Error
  );
  if (validNavList.length >= 1) {
    const isOdd = !!(validNavList.length % 2);
    const lastTwoNavs = validNavList.slice(-2);
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

  return updatedState;
}

export default {
  updateNavigationPath,
  updateNavTypes,
};
