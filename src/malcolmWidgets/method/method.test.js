import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import MethodDetails from './method.component';
import {
  malcolmSetFlag,
  malcolmPostAction,
} from '../../malcolm/malcolmActionCreators';

jest.mock('../../malcolm/malcolmActionCreators');

const testInputs = {
  first: {
    label: 'First input',
    tags: ['widget:textinput'],
  },
  second: {
    label: 'Second input',
    description: 'a test input',
    tags: ['widget:textinput'],
  },
};

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

let state = { malcolm: { blocks: { Test: { attributes: [] } } } };

const store = {
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
};

const testMethod = (
  inputs,
  outputs,
  defaults,
  inputValues,
  outputValues,
  errorMsg
) => {
  const method = {};
  method.name = 'Method';
  method.label = 'Test';
  method.errorState = !!errorMsg;
  method.errorMessage = errorMsg;
  method.path = ['Test', 'Method'];
  method.defaults = defaults;
  method.inputs = inputValues;
  method.takes = { elements: { ...inputs } };
  method.returns = { elements: { ...outputs } };
  method.outputs = outputValues;

  state.malcolm.blocks.Test.attributes = [method];

  return (
    <MethodDetails store={store} blockName="Test" attributeName="Method" />
  );
};

describe('Method widget', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
    state = { malcolm: { blocks: { Test: { attributes: [] } } } };
  });

  it('displays empty inputs', () => {
    const wrapper = shallow(testMethod(testInputs, {}, {}, {}, {}, ''));
    expect(wrapper).toMatchSnapshot();
  });

  it('displays inputs with defaults', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, defaultInputs, {}, {}, '')
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays inputs with existing values', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, {}, testInputValues, {}, '')
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays errored', () => {
    const wrapper = shallow(
      testMethod(testInputs, {}, {}, {}, {}, 'test Error!')
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays with empty return fields', () => {
    const wrapper = shallow(
      testMethod(testInputs, testOutputs, {}, {}, {}, '')
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays with returned values', () => {
    const wrapper = shallow(
      testMethod(testInputs, testOutputs, {}, {}, testOutputValues, '')
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls run method on button click', () => {
    const wrapper = mount(
      testMethod(testInputs, testOutputs, {}, testInputValues, {}, '')
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(malcolmSetFlag).toHaveBeenCalledTimes(1);
    expect(malcolmPostAction).toHaveBeenCalledTimes(1);
    expect(malcolmPostAction).toHaveBeenCalledWith(
      ['Test', 'Method'],
      testInputValues
    );
  });
});
