import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import MethodComponent, { mapDispatchToProps } from './method.component';
import {
  malcolmPostAction,
  malcolmSetFlag,
} from '../../malcolm/malcolmActionCreators';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';

jest.mock('../../malcolm/malcolmActionCreators');
jest.mock('../../malcolm/actions/method.actions');

describe('Method component', () => {
  let shallow;
  let mockStore;
  let mount;
  let testInputs;

  const state = { malcolm: { blocks: { Test: { attributes: [] } } } };

  const defaultInputs = {
    first: 1,
    second: 'two',
  };

  const testOutputs = {
    first: {
      label: 'First output',
      tags: ['widget:led'],
    },
    second: {
      label: 'Second output',
      tags: ['widget:textupdate'],
    },
  };

  const testInputValues = {
    first: 3,
    second: 'four',
  };

  const testOutputValues = {
    first: true,
    second: 'done',
  };

  const testMethod = (
    inputs,
    outputs,
    defaults,
    inputValues,
    outputValues,
    errorMsg
  ) => {
    const method = {
      name: 'Method',
      label: 'Test',
      errorState: !!errorMsg,
      errorMessage: errorMsg,
      path: ['Test', 'Method'],
      defaults,
      inputs: inputValues,
      takes: { elements: { ...inputs } },
      returns: { elements: { ...outputs } },
      outputs: outputValues,
    };

    state.malcolm.blocks.Test.attributes = [method];

    return (
      <MethodComponent
        store={mockStore(state)}
        blockName="Test"
        attributeName="Method"
      />
    );
  };

  beforeEach(() => {
    malcolmSetFlag.mockClear();
    malcolmUpdateMethodInput.mockClear();
    malcolmPostAction.mockClear();

    mockStore = myState => ({
      getState: () => myState,
      subscribe: () => {},
      dispatch: () => {},
    });

    shallow = createShallow({ dive: true });
    mount = createMount();

    testInputs = {
      first: {
        label: 'First input',
        description: 'a test input',
        tags: ['widget:textinput'],
      },
      second: {
        label: 'Second input',
        description: 'a test input',
        tags: ['widget:textinput'],
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly with empty inputs', () => {
    const wrapper = shallow(testMethod(testInputs, {}, {}, {}, {}, ''));
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with default inputs', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, defaultInputs, {}, {}, '')
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with existing input values', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, {}, testInputValues, {}, '')
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with return value', () => {
    const wrapper = shallow(
      testMethod(testInputs, testOutputs, {}, {}, testOutputValues, '')
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mapDispatchToProps updateInput signals a method input needs updating', () => {
    const dispatch = () => {};
    const dispatchProps = mapDispatchToProps(dispatch);

    dispatchProps.updateInput(['path'], 'name', 'value');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
  });

  it('calls runMethod correctly on button click', () => {
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(malcolmSetFlag).toHaveBeenCalledTimes(1);
    expect(malcolmSetFlag).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'pending',
      true
    );
    expect(malcolmPostAction).toHaveBeenCalledTimes(1);
    expect(malcolmPostAction).toHaveBeenCalledWith(
      ['Test', 'Method'],
      testInputValues
    );
  });

  it('calls updateInput correctly on changed input', () => {
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
    );
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'test' } });
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(2);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'first',
      'test'
    );
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'first',
      { isDirty: true }
    );
  });

  it('buildIOcomponent returns null if no widget tag', () => {
    testInputs.second.tags = [];
    const wrapper = shallow(testMethod(testInputs, {}, {}, {}, {}, ''));
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
