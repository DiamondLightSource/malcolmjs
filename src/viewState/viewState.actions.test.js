import { openParentPanel, openChildPanel } from './viewState.actions';

it('openParentPanel signals the open state of the parent panel', () => {
  const action = openParentPanel(true);

  expect(action.type).toEqual('OPEN_PARENT_PANEL');
  expect(action.openParentPanel).toEqual(true);
});

it('openChildPanel signals the open state of the child panel', () => {
  const action = openChildPanel(true);

  expect(action.type).toEqual('OPEN_CHILD_PANEL');
  expect(action.openChildPanel).toEqual(true);
});
