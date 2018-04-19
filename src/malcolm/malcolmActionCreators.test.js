import { malcolmGetAction } from './malcolmActionCreators';

it('malcolm GET actions have right properties', () => {
  const path = ['pathA', 'pathB'];
  const getAction = malcolmGetAction(path);

  expect(getAction.type).toEqual('malcolm:send');
  expect(getAction.typeid).toEqual('malcolm:core/Get:1.0');
  expect(getAction.path).toEqual(path);
});
