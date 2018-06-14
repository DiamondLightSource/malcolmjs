import ViewStateReducer from './viewState.reducer';
import { openParentPanel, updateVersionNumber } from './viewState.actions';

describe('view state reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      openParentPanel: true,
      openChildPanel: true,
    };
  });

  it('returns state if not a recognised type', () => {
    const newState = ViewStateReducer(state, { type: 'TEST' });
    expect(newState).toBe(state);
  });

  it('openParentPanelType messages update the parent panel state', () => {
    const newState = ViewStateReducer(state, openParentPanel(false));
    expect(newState.openParentPanel).toEqual(false);
    expect(newState.openChildPanel).toEqual(true);
  });

  it('updateVersionNumerType messages updates the document title', () => {
    const newState = ViewStateReducer(state, updateVersionNumber('1.2.3'));

    expect(newState).toBe(state);
    expect(document.title).toEqual('MalcolmJS 1.2.3');
  });
});
