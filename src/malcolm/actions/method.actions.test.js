import { buildMethodUpdate, malcolmUpdateMethodInput } from './method.actions';
import {
  MalcolmAttributeData,
  MalcolmUpdateMethodInputType,
} from '../malcolm.types';

describe('method actions', () => {
  it('buildMethodUpdate sends an attribute update message', () => {
    const action = buildMethodUpdate(123, { prop: 'test' });

    expect(action.type).toEqual(MalcolmAttributeData);
    expect(action.payload.id).toEqual(123);
    expect(action.payload.prop).toEqual('test');
    expect(action.payload.calculated.isMethod).toBeTruthy();
    expect(action.payload.delta).toBeTruthy();
    expect(action.payload.calculated.pending).toBeFalsy();
  });

  it('malcolmUpdateMethodInput sends the info needed to update an input', () => {
    const action = malcolmUpdateMethodInput(
      ['PANDA', 'save'],
      'design',
      'test'
    );

    expect(action.type).toEqual(MalcolmUpdateMethodInputType);
    expect(action.payload.path).toEqual(['PANDA', 'save']);
    expect(action.payload.name).toEqual('design');
    expect(action.payload.value).toEqual('test');
  });
});
