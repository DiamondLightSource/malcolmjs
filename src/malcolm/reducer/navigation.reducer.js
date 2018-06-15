export const processNavigationLists = (paths, blocks) => {
  const navigationLists = paths.map(p => ({
    path: p,
    children: [],
    basePath: '/',
    label: p,
  }));

  const rootNav = {
    path: '',
    children: [],
  };

  if (blocks['.blocks']) {
    rootNav.children = blocks['.blocks'].children;
    rootNav.childrenLabels = blocks['.blocks'].children;
  }

  let previousBlock;
  let basePath = '/';
  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    basePath = `${basePath + path}/`;

    if (blocks[path]) {
      previousBlock = blocks[path];
      navigationLists[i].children = previousBlock.children;
      navigationLists[i].childrenLabels = [...previousBlock.children];

      navigationLists[i].label = path;

      // if the part of the path before is layout then lookup the name
      if (
        i > 1 &&
        blocks[paths[i - 2]] &&
        blocks[paths[i - 2]].attributes &&
        paths[i - 1] === 'layout'
      ) {
        const layoutAttribute = blocks[paths[i - 2]].attributes.find(
          a => a.name === 'layout'
        );

        if (layoutAttribute && layoutAttribute.value) {
          const matchingIndex = layoutAttribute.value.mri.findIndex(
            mri => mri === path
          );
          navigationLists[i].label =
            matchingIndex > -1
              ? layoutAttribute.value.name[matchingIndex]
              : 'not found';
        }
      }
    } else if (previousBlock && previousBlock.attributes) {
      const matchingAttribute = previousBlock.attributes.findIndex(
        a => a.name === path
      );
      if (matchingAttribute > -1) {
        const attribute = previousBlock.attributes[matchingAttribute];
        navigationLists[i].children = attribute.children;

        if (path === 'layout') {
          // get child labels from attribute table
          navigationLists[i].childrenLabels = attribute.children
            .map(child => attribute.value.mri.findIndex(mri => mri === child))
            .map(
              (mriIndex, j) =>
                mriIndex > -1
                  ? attribute.value.name[mriIndex]
                  : attribute.value.mri[j]
            );
        } else {
          navigationLists[i].childrenLabels = [...attribute.children];
        }
      }

      navigationLists[i].label = path;
    }

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

export default {
  updateNavigationPath,
};
