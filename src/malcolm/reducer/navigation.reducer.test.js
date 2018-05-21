import NavigationReducer from './navigation.reducer';

describe('navigation reducer', () => {
  it('updateNavigationPath set navigation on state', () => {
    let state = {};
    const blockPaths = ['PANDA', 'layout', 'PANDA:TTLIN1'];
    const payload = {
      blockPaths,
    };

    state = NavigationReducer.updateNavigationPath(state, payload);

    expect(state.navigation).not.toBeNull();
    expect(state.navigation).toEqual(blockPaths);
  });
});
