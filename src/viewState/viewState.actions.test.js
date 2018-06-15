import {
  openParentPanel,
  closeChildPanel,
  updateVersionNumber,
  updateChildPanel,
} from './viewState.actions';

it('openParentPanel signals the open state of the parent panel', () => {
  const action = openParentPanel(true);

  expect(action.type).toEqual('OPEN_PARENT_PANEL');
  expect(action.openParentPanel).toEqual(true);
});

it('closeChildPanel updates the route to remove the child', () => {
  const action = closeChildPanel('/gui/PANDA/layout/PANDA:SEQ1');

  expect(action.type).toEqual('@@router/CALL_HISTORY_METHOD');
  expect(action.payload.args[0]).toEqual('/gui/PANDA/layout');
});

it('updateVersionNumber signals the version number', () => {
  const action = updateVersionNumber('1.2.3');

  expect(action.type).toEqual('UPDATE_VERSION');
  expect(action.payload.version).toEqual('1.2.3');
});

it('updateChildPanel adds to the end of the route if it ends in layout', () => {
  const action = updateChildPanel('/gui/PANDA/layout', 'PANDA:SEQ1');

  expect(action.type).toEqual('@@router/CALL_HISTORY_METHOD');
  expect(action.payload.args[0]).toEqual('/gui/PANDA/layout/PANDA:SEQ1');
});

it('updateChildPanel replaces the end of the route if it does not end in layout', () => {
  const action = updateChildPanel('/gui/PANDA/layout/TTLIN1', 'PANDA:SEQ1');

  expect(action.type).toEqual('@@router/CALL_HISTORY_METHOD');
  expect(action.payload.args[0]).toEqual('/gui/PANDA/layout/PANDA:SEQ1');
});
