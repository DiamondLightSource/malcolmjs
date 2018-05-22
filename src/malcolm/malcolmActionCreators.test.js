import {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmSnackbarState,
} from './malcolmActionCreators';

it('malcolm GET actions have right properties', () => {
  const path = ['pathA', 'pathB'];
  const getAction = malcolmGetAction(path);

  expect(getAction.type).toEqual('malcolm:send');
  expect(getAction.payload.typeid).toEqual('malcolm:core/Get:1.0');
  expect(getAction.payload.path).toEqual(path);
});

it('malcolm SUBSCRIBE actions have right properties', () => {
  const path = ['pathA', 'pathB'];
  const subscribeAction = malcolmSubscribeAction(path);

  expect(subscribeAction.type).toEqual('malcolm:send');
  expect(subscribeAction.payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
  expect(subscribeAction.payload.path).toEqual(path);
  expect(subscribeAction.payload.delta).toEqual(true);
});

it('malcolm new block action has right properties', () => {
  const blockName = 'TTLIN1';
  const action = malcolmNewBlockAction(blockName, true, false);

  expect(action.type).toEqual('malcolm:newblock');
  expect(action.payload.blockName).toEqual(blockName);
  expect(action.payload.parent).toEqual(true);
  expect(action.payload.child).toEqual(false);
});

it('malcolm snackbar actions have right properties', () => {
  const isOpen = true;
  const message = 'this is a test';
  const subscribeAction = malcolmSnackbarState(isOpen, message);

  expect(subscribeAction.type).toEqual('malcolm:snackbar');
  expect(subscribeAction.snackbar.open).toEqual(true);
  expect(subscribeAction.snackbar.message).toEqual('this is a test');
});
