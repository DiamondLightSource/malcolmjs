function updateNavigationPath(state, payload) {
  const navigation = payload.blockPaths;
  return { ...state, navigation };
}

export default {
  updateNavigationPath,
};
