// eslint-disable-next-line no-unused-vars
import MethodReducer, { handleMethodReturn } from './method.reducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType } from '../malcolm.types';

describe('method reducer', () => {
  it('updateMethodInput should update the input on a method', () => {
    const state = {
      blocks: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              inputs: {},
            },
          ],
        },
      },
    };

    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      value: 123,
    };

    const action = {
      type: MalcolmUpdateMethodInputType,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    const attribute = blockUtils.findAttribute(
      updatedState.blocks,
      'block1',
      'attr1'
    );
    expect(attribute.inputs.input1).toEqual(123);
  });
});
