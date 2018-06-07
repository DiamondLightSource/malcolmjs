import ViewStateReducer from './viewState.reducer';
import { openParentPanel } from './viewState.actions';

describe('view state reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      openParentPanel: true,
      openChildPanel: true,
    };
  });

  it('openParentPanelType messages update the parent panel state', () => {
    const newState = ViewStateReducer(state, openParentPanel(false));
    expect(newState.openParentPanel).toEqual(false);
    expect(newState.openChildPanel).toEqual(true);
  });
});
