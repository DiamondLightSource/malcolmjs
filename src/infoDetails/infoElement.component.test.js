import React from 'react';
import configureStore from 'redux-mock-store';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import InfoElement from './infoElement.component';
import { harderAttribute } from '../malcolmWidgets/table/table.stories';

const state = {
  malcolm: {
    blocks: {
      test1: {
        attributes: [harderAttribute],
      },
    },
  },
};
describe('InfoElement', () => {
  let shallow;
  let mount;
  let mockStore;
  beforeEach(() => {
    harderAttribute.calculated.testStuff = {
      somethingFalse: false,
      somethingTrue: true,
      aString: 'testing!',
      aNumber: 1,
    };
    mockStore = configureStore();
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  it('renders correctly with value given', () => {
    const wrapper = shallow(
      <InfoElement
        key={1}
        label="Test element"
        value="testing..."
        alarm={null}
        tag="info:multiline"
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with paths given', () => {
    const wrapper = shallow(
      <InfoElement
        key={1}
        blockName="test1"
        attributeName="layout"
        label="Test element"
        valuePath="calculated.testStuff.aString"
        alarmPath="calculated.testStuff.aNumber"
        tag="info:multiline"
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('button hooks up correctly', () => {
    const clickHandler = jest.fn();
    const wrapper = mount(
      <InfoElement
        key={1}
        label="Test element"
        value="test button"
        alarm={null}
        tag="info:button"
        handlers={{ clickHandler }}
        store={mockStore(state)}
      />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  const runDisabledButtonTest = extraProps => {
    const clickHandler = jest.fn();
    const wrapper = mount(
      <InfoElement
        key={1}
        blockName="test1"
        attributeName="layout"
        label="Test element"
        value="test button"
        alarm={null}
        tag="info:button"
        handlers={{ clickHandler }}
        store={mockStore(state)}
        {...extraProps}
      />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(clickHandler).toHaveBeenCalledTimes(0);
  };

  it('button disables correctly', () => {
    runDisabledButtonTest({
      disabled: true,
    });
  });

  it('button disables correctly with flag path', () => {
    runDisabledButtonTest({
      disabledFlagPath: 'calculated.testStuff.somethingTrue',
    });
  });

  it('button disables correctly with flag path with NOT', () => {
    runDisabledButtonTest({
      disabledFlagPath: 'NOT.calculated.testStuff.somethingFalse',
    });
  });
});
