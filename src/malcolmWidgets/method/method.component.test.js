import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import MethodComponent, { mapDispatchToProps } from './method.component';
import {
  malcolmPostAction,
  malcolmSetFlag,
} from '../../malcolm/malcolmActionCreators';
import {
  malcolmUpdateMethodInput,
  malcolmIntialiseMethodParam,
} from '../../malcolm/actions/method.actions';
import navigationActions from '../../malcolm/actions/navigation.actions';
import { Widget } from '../attributeDetails/attributeSelector/attributeSelector.component';

jest.mock('../../malcolm/actions/navigation.actions');
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
      tags: [Widget.LED],
    },
    second: {
      label: 'Second output',
      tags: [Widget.TEXTUPDATE],
    },
  };

  const testInputValues = {
    first: 3,
    second: 'four',
  };

  const testInputState = {};
  Object.keys(testInputValues).forEach(input => {
    testInputState[input] = { value: testInputValues[input], flags: {} };
  });

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
    errorMsg,
    writeable = true,
    flags = {}
  ) => {
    const inputState = {};
    Object.keys(inputValues).forEach(input => {
      inputState[input] = { value: inputValues[input], flags: {} };
    });
    Object.keys(flags).forEach(input => {
      inputState[input] = { ...inputState[input], flags: flags[input] };
    });
    const outputState = {};
    Object.keys(outputValues).forEach(output => {
      outputState[output] = { value: outputValues[output] };
    });
    const method = {
      calculated: {
        name: 'Method',
        path: ['Test', 'Method'],
        errorState: !!errorMsg,
        errorMessage: errorMsg,
        inputs: inputState,
        outputs: outputState,
      },
      raw: {
        meta: {
          label: 'Test',
          defaults,
          takes: { elements: { ...inputs } },
          returns: { elements: { ...outputs } },
          writeable,
        },
      },
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
    navigationActions.navigateToSubElement.mockClear();
    malcolmIntialiseMethodParam.mockClear();
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
        tags: [Widget.TEXTINPUT],
        writeable: true,
      },
      second: {
        label: 'Second input',
        description: 'a test input',
        tags: [Widget.TEXTINPUT],
        writeable: true,
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

  it('renders correctly with no inputs or outputs', () => {
    const wrapper = shallow(testMethod({}, {}, {}, {}, {}, ''));
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with default inputs', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, defaultInputs, {}, {}, '')
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with invalid inputs', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, defaultInputs, {}, {}, '', true, {
        first: { invalid: 'this is not valid' },
      })
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

  it('renders correctly without return value', () => {
    const wrapper = shallow(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
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
      .last()
      .simulate('click');
    expect(malcolmPostAction).toHaveBeenCalledTimes(1);
    expect(malcolmPostAction).toHaveBeenCalledWith(
      ['Test', 'Method'],
      testInputState
    );
  });

  it('method run button disables if not writeable', () => {
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '', false)
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(malcolmSetFlag).not.toHaveBeenCalled();
    expect(malcolmPostAction).not.toHaveBeenCalled();
  });

  it('calls updateInput correctly on changed input', () => {
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
    );
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'test' } });
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method', 'takes.first'],
      'first',
      'test'
    );
  });

  it('buildIOcomponent returns null if no widget tag', () => {
    testInputs.second.tags = [];
    const wrapper = shallow(testMethod(testInputs, {}, {}, {}, {}, ''));
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('buildIOcomponent hooks up initialise state action to view button for array type params', () => {
    testInputs.first.typeid = 'foo:bar/someArrayMeta:1.6';
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
    );
    wrapper
      .find('button')
      .at(1)
      .simulate('click');
    expect(navigationActions.navigateToSubElement).toHaveBeenCalledTimes(1);
    expect(navigationActions.navigateToSubElement).toHaveBeenCalledWith(
      'Test',
      'Method',
      'takes.first'
    );
    expect(malcolmIntialiseMethodParam).toHaveBeenCalledTimes(1);
    expect(malcolmIntialiseMethodParam).toHaveBeenCalledWith(
      ['Test', 'Method', 'takes.first'],
      ['takes', 'first']
    );
  });
});
