function updateNavigationPath(state, payload) {
  const navigation = payload.blockPaths;
  return {
    ...state,
    navigation,
    parentBlock: undefined,
    childBlock: undefined,
    mainAttribute: undefined,
  };
}

export default {
  updateNavigationPath,
};
