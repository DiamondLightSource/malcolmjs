import {
  openParentPanel,
  updateVersionNumber,
  showFooterAction,
} from './viewState.actions';

describe('View State Actions', () => {
  it('openParentPanel signals the open state of the parent panel', () => {
    const action = openParentPanel(true);

    expect(action.type).toEqual('OPEN_PARENT_PANEL');
    expect(action.openParentPanel).toEqual(true);
  });

  it('updateVersionNumber signals the version number', () => {
    const action = updateVersionNumber('1.2.3', 'App title');

    expect(action.type).toEqual('UPDATE_VERSION');
    expect(action.payload.version).toEqual('1.2.3');
    expect(action.payload.title).toEqual('App title');
  });

  it('showFooterAction updates the footer height', () => {
    const action = showFooterAction(100);

    expect(action.type).toEqual('SHOW_FOOTER_TYPE');
    expect(action.payload.footerHeight).toEqual(100);
  });
});
