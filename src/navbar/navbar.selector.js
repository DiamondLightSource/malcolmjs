const processNavigationLists = (paths, blocks) => {
  const navigationLists = paths.map(p => ({
    path: p,
    children: [],
    basePath: '/',
  }));

  if (navigationLists.length === 0) {
    navigationLists.push({
      path: '',
      children: [],
      basePath: '/',
    });
  }

  if (Object.prototype.hasOwnProperty.call(blocks, '.blocks')) {
    navigationLists[0].children = blocks['.blocks'].children;
  }

  let previousBlock;
  let basePath = '/';
  for (let i = 1; i < paths.length; i += 1) {
    const path = paths[i - 1];
    basePath = `${basePath + path}/`;

    if (Object.prototype.hasOwnProperty.call(blocks, path)) {
      previousBlock = blocks[path];
      navigationLists[i].children = previousBlock.children;
    } else if (previousBlock && previousBlock.attributes) {
      const matchingAttribute = previousBlock.attributes.findIndex(
        a => a.name === path
      );
      if (matchingAttribute > -1) {
        const attribute = previousBlock.attributes[matchingAttribute];
        navigationLists[i].children = attribute.children;
      }
    }

    navigationLists[i].basePath = basePath;
  }

  return navigationLists;
};

export default {
  processNavigationLists,
};
