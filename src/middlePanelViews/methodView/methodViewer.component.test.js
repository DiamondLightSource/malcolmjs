import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import MethodViewer from './methodViewer.component';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';
import MockCircularBuffer from '../../malcolm/reducer/attribute.reducer.mocks';

jest.mock('../../malcolm/actions/method.actions');

describe('Method viewer', () => {
  let shallow;
  let mockStore;
  let mount;
  let testInputs;
  let freshArchive;

  const getItem = jest.fn();
  const setItem = jest.fn();

  const state = {
    malcolm: {
      blocks: { Test: { attributes: [] } },
      blockArchive: { Test: { attributes: [] } },
    },
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
    second: { value: 'four', isAString: true },
  };

  const testMethodViewer = (
    inputs,
    outputs,
    inputValues,
    selected,
    errorMsg,
    archiveContents
  ) => {
    const method = {
      calculated: {
        name: 'Method',
        path: ['Test', 'Method'],
        errorState: !!errorMsg,
        errorMessage: errorMsg,
        inputs: inputValues,
        outputs: {},
      },
      raw: {
        label: 'Test',
        defaults: {},
        takes: { elements: { ...inputs } },
        returns: { elements: { ...outputs } },
      },
    };

    state.malcolm.blocks.Test.attributes = [method];
    state.malcolm.blockArchive.Test.attributes = [archiveContents];

    return (
      <MethodViewer
        store={mockStore(state)}
        blockName="Test"
        attributeName="Method"
        subElement={selected}
        classes={{}}
      />
    );
  };

  beforeEach(() => {
    getItem.mockClear();
    setItem.mockClear();
    malcolmUpdateMethodInput.mockClear();

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
        tags: ['widget:tree'],
      },
    };
    freshArchive = {
      name: 'Method',
      timeStamp: new MockCircularBuffer(5),
      value: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly with no initial value', () => {
    const wrapper = shallow(
      testMethodViewer(
        testInputs,
        testOutputs,
        {},
        ['takes', 'second'],
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with initial value', () => {
    const wrapper = shallow(
      testMethodViewer(
        testInputs,
        testOutputs,
        testInputValues,
        ['takes', 'second'],
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders method param archive if selected parameter isnt a tree', () => {
    const wrapper = shallow(
      testMethodViewer(
        testInputs,
        testOutputs,
        {},
        ['takes', 'first'],
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders top-level method param archive if no selected parameter', () => {
    const wrapper = shallow(
      testMethodViewer(
        testInputs,
        testOutputs,
        {},
        undefined,
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  // it('updates method input after 1s inactivity', () => {});
  /*
  it('save button hooks up correctly', () => {
    Object.defineProperty(window, 'localStorage', {
      value: { setItem, getItem },
    });
    const wrapper = mount(
      testMethodViewer(testInputs, testOutputs, testInputValues, [
        'takes',
        'second',
      ])
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith(
      'Test,Method.takes,second',
      '{"value":"four","isAString":true}'
    );
  });

  it('load button hooks up correctly', () => {
    getItem.mockReturnValue('{"value":5,"isAString":false}');
    Object.defineProperty(window, 'localStorage', {
      value: { setItem, getItem },
    });
    const wrapper = mount(
      testMethodViewer(testInputs, testOutputs, {}, ['takes', 'second'])
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(getItem).toHaveBeenCalledTimes(1);
    expect(getItem).toHaveBeenCalledWith('Test,Method.takes,second');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'second',
      {
        value: 5,
        isAString: false,
      }
    );
  }); */
});