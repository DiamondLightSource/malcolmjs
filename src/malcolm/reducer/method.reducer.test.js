import MethodReducer from './method.reducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType, MalcolmReturn } from '../malcolm.types';

describe('method reducer', () => {
  const testMessage = {
    id: 2,
    typeid: 'malcolm:core/Post:1.0',
    path: ['block1', 'attr1'],
  };
  let state;

  beforeEach(() => {
    state = {
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
      messagesInFlight: [],
    };
  });

  it('updateMethodInput should update the input on a method', () => {
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
    state.blocks.block1.attributes[0].dirtyInputs = { input1: false };

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
    state.blocks.block1.attributes[0].returns = { elements: { output1: {} } };
    state.messagesInFlight = [testMessage];

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
    state.blocks.block1.attributes[0].returns = { elements: { output1: {} } };
    state.blocks.block1.attributes[0].tags = ['method:return:unpacked'];
    state.messagesInFlight = [testMessage];

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

  it('handleMethodReturn should do nothing if original request wasnt a post', () => {
    state.blocks.block1.attributes[0].returns = { elements: { output1: {} } };
    state.blocks.block1.attributes[0].tags = ['method:return:unpacked'];

    state.messagesInFlight = [
      {
        id: 2,
        typeid: 'malcolm:core/Put:1.0',
        path: ['block1', 'attr1'],
      },
    ];

    const payload = {
      id: 2,
      value: 456,
    };

    const action = {
      type: MalcolmReturn,
      payload,
    };

    const updatedState = MethodReducer(state, action);
    expect(updatedState).toEqual(state);
  });

  it('handleMethodReturn should error if return map is missing an output', () => {
    state.blocks.block1.attributes[0].returns = {
      elements: { output1: {}, output2: {} },
    };
    state.messagesInFlight = [testMessage];
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
