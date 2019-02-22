import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors/index';
import MethodViewer from './methodViewer.component';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';
import MockCircularBuffer from '../../malcolm/reducer/attribute.reducer.mocks';
import { malcolmTypes } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

jest.mock('../../malcolm/actions/method.actions');

const mockTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
  },
  alarmState: {
    warning: '#e6c01c',
    error: '#e8001f',
    disconnected: '#9d07bb',
  },
});

const pushTestData = freshArchive => {
  freshArchive.value.push({
    took: {
      first: '0',
      second: { someJSON: true },
      third: ['anArray'],
    },
    returned: { first: false, second: 'someText' },
  });
  freshArchive.timeStamp.push({
    runTime: new Date(0),
    returnTime: new Date(1536583618205),
  });
  freshArchive.alarmState.push(0);
  freshArchive.value.push({
    took: { first: 0 },
    returned: {},
  });
  freshArchive.timeStamp.push({
    runTime: new Date(-14258382000),
    returnTime: new Date(123456789),
  });
  freshArchive.alarmState.push(4);
  return freshArchive;
};

describe('Method viewer', () => {
  let shallow;
  let mockStore;
  let mount;
  let testInputs;
  let freshArchive;
  let testInputValues;

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
    third: {
      label: 'Third output',
      tags: ['widget:textupdate'],
      typeid: malcolmTypes.stringArray,
    },
  };

  const testOutputValues = {
    first: true,
    second: 'done',
    third: ['something finished'],
  };

  const testMethodViewer = (
    outputValues,
    selected,
    errorMsg,
    archiveContents
  ) => {
    const inputState = {};
    Object.keys(testInputValues).forEach(input => {
      inputState[input] =
        testInputValues[input].value === undefined
          ? { value: testInputValues[input] }
          : testInputValues[input];
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
        isMethod: true,
      },
      raw: {
        meta: {
          label: 'Test',
          defaults: {},
          takes: { elements: { ...testInputs } },
          returns: { elements: { ...testOutputs } },
        },
      },
    };

    state.malcolm.blocks.Test.attributes = [method];
    state.malcolm.blockArchive.Test.attributes = [archiveContents];

    return (
      <MuiThemeProvider theme={mockTheme}>
        <MethodViewer
          store={mockStore(state)}
          blockName="Test"
          attributeName="Method"
          subElement={selected}
          classes={{}}
        />
      </MuiThemeProvider>
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

    testInputValues = {
      first: 3,
      second: { value: 'four', isAString: true },
      third: {
        value: ['SEVEN'],
        flags: { rows: [] },
        meta: {
          typeid: malcolmTypes.stringArray,
          tags: ['widget:textinput'],
          writeable: true,
        },
      },
    };

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
      third: {
        label: 'Third input',
        description: 'an array',
        tags: ['widget:textinput'],
        typeid: malcolmTypes.stringArray,
        writeable: true,
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

  it('renders input correctly with no initial value', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer({}, ['takes', 'first'], undefined, freshArchive)
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders input correctly with initial value', () => {
    const wrapper = shallow(
      testMethodViewer({}, ['takes', 'first'], undefined, freshArchive)
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders output correctly with no initial value', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer({}, ['returns', 'first'], undefined, freshArchive)
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders output correctly with initial value', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer(
        testOutputValues,
        ['returns', 'first'],
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders output array correctly', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer(
        testOutputValues,
        ['returns', 'third'],
        undefined,
        freshArchive
      )
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders method param archive if selected parameter isnt a tree', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer({}, ['takes', 'first'], undefined, freshArchive)
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders top-level method param archive if no selected parameter', () => {
    testInputValues = {};
    const wrapper = shallow(
      testMethodViewer({}, undefined, undefined, pushTestData(freshArchive))
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  /* TODO: fix tests for virtualizedTable-based array
  it('copy params button hooks in correctly on top-level method param archive', () => {
    testInputValues = {};
    const wrapper = mount(
      testMethodViewer({}, undefined, undefined, pushTestData(freshArchive))
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(3);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'third',
      ['anArray']
    );
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'second',
      { someJSON: true }
    );
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'first',
      '0'
    );
    malcolmUpdateMethodInput.mockClear();
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(3);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'third',
      undefined
    );
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'second',
      undefined
    );
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'first',
      0
    );
  });
  */
  // it('updates method input after 1s inactivity', () => {});

  it('renders correctly for array once local state is initialised', () => {
    const wrapper = shallow(
      testMethodViewer({}, ['takes', 'third'], undefined, freshArchive)
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('add row hooks up correctly for array', () => {
    const wrapper = mount(
      testMethodViewer({}, ['takes', 'third'], undefined, freshArchive)
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'third',
      ['SEVEN', '']
    );
  });
  /* TODO: fix tests for virtualizedTable-based array
  it('update input hooks up correctly for array', () => {
    const wrapper = mount(
      testMethodViewer({}, ['takes', 'third'], undefined, freshArchive)
    );
    console.log(wrapper.debug());
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: '180' } });
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
    expect(malcolmUpdateMethodInput).toHaveBeenCalledWith(
      ['Test', 'Method'],
      'third',
      ['180']
    );
  });

  it('update input hooks up correctly for array if writeable is false', () => {
    testInputs.third.writeable = false;
    const wrapper = mount(
      testMethodViewer({}, ['takes', 'third'], undefined, freshArchive)
    );
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: '180' } });
    expect(malcolmUpdateMethodInput).not.toHaveBeenCalled();
  });
  */
});
