export const processNavigationLists = (paths, blocks) => {
  const navigationLists = paths.map(p => ({
    path: p,
    children: [],
    basePath: '/',
    label: p,
  }));

  if (navigationLists.length === 0) {
    navigationLists.push({
      path: '',
      children: [],
      basePath: '/',
      label: '',
    });
  }

  const rootNav = {
    path: '',
    children: [],
  };

  if (Object.prototype.hasOwnProperty.call(blocks, '.blocks')) {
    rootNav.children = blocks['.blocks'].children;
  }

  let previousBlock;
  let basePath = '/';
  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    basePath = `${basePath + path}/`;

    if (Object.prototype.hasOwnProperty.call(blocks, path)) {
      previousBlock = blocks[path];
      navigationLists[i].children = previousBlock.children;
      navigationLists[i].label = i === 0 ? path : previousBlock.label;
    } else if (previousBlock && previousBlock.attributes) {
      const matchingAttribute = previousBlock.attributes.findIndex(
        a => a.name === path
      );
      if (matchingAttribute > -1) {
        const attribute = previousBlock.attributes[matchingAttribute];
        navigationLists[i].children = attribute.children;
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
