import { openParentPanel, closeChildPanel } from './viewState.actions';

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
