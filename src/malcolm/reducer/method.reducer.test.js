import MethodReducer from './method.reducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType, MalcolmReturn } from '../malcolm.types';

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

  it('updateMethodInput should flag an input on a method as dirty', () => {
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
      value: { isDirty: true },
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
    expect(attribute.dirtyInputs.input1).toBeTruthy();
  });

  it('updateMethodInput should update dirty state of an input on a method', () => {
    const state = {
      blocks: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              inputs: {},
              dirtyInputs: {
                input1: false,
              },
            },
          ],
        },
      },
    };

    const payload = {
      path: ['block1', 'attr1'],
      name: 'input1',
      value: { isDirty: true },
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
    expect(attribute.dirtyInputs.input1).toBeTruthy();
  });

  it('handleMethodReturn should update the output on a method with return map', () => {
    const state = {
      blocks: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              inputs: {},
              returns: {
                elements: {
                  output1: {},
                },
              },
            },
          ],
        },
      },
      messagesInFlight: [
        {
          id: 2,
          typeid: 'malcolm:core/Post:1.0',
          path: ['block1', 'attr1'],
        },
      ],
    };

    const payload = {
      id: 2,
      value: { output1: 456 },
    };

    const action = {
      type: MalcolmReturn,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    const attribute = blockUtils.findAttribute(
      updatedState.blocks,
      'block1',
      'attr1'
    );
    expect(attribute.outputs.output1).toEqual(456);
  });

  it('handleMethodReturn should update the output on a method with return unpacked', () => {
    const state = {
      blocks: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              inputs: {},
              returns: {
                elements: {
                  output1: {},
                },
              },
              tags: ['method:return:unpacked'],
            },
          ],
        },
      },
      messagesInFlight: [
        {
          id: 2,
          typeid: 'malcolm:core/Post:1.0',
          path: ['block1', 'attr1'],
        },
      ],
    };

    const payload = {
      id: 2,
      value: 456,
    };

    const action = {
      type: MalcolmReturn,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    const attribute = blockUtils.findAttribute(
      updatedState.blocks,
      'block1',
      'attr1'
    );
    expect(attribute.outputs.output1).toEqual(456);
  });

  it('handleMethodReturn should error if return map is missing an output', () => {
    const state = {
      blocks: {
        block1: {
          attributes: [
            {
              name: 'attr1',
              inputs: {},
              returns: {
                elements: {
                  output1: {},
                  output2: {},
                },
              },
            },
          ],
        },
      },
      messagesInFlight: [
        {
          id: 2,
          typeid: 'malcolm:core/Post:1.0',
          path: ['block1', 'attr1'],
        },
      ],
    };

    const payload = {
      id: 2,
      value: { output1: 456 },
    };

    const action = {
      type: MalcolmReturn,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    const attribute = blockUtils.findAttribute(
      updatedState.blocks,
      'block1',
      'attr1'
    );
    expect(attribute.errorState).toBeTruthy();
  });
});
