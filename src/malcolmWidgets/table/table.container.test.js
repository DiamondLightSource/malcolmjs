import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import WidgetTable from './table.container';
import { harderAttribute } from './table.stories';
import {
  malcolmSetFlag,
  malcolmSetTableFlag,
  malcolmUpdateTable,
  malcolmCopyValue,
  malcolmPutAction,
} from '../../malcolm/malcolmActionCreators';

// jest.mock('../../malcolm/malcolmActionCreators');

describe('Table container', () => {
  let shallow;
  let mockStore;
  let state;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
    mockStore = configureStore();
    state = {
      malcolm: {
        blocks: {
          test1: {
            attributes: [harderAttribute],
          },
        },
      },
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <WidgetTable
        blockName="test1"
        attributeName="layout"
        eventHandler={() => {}}
        setFlag={() => {}}
        store={mockStore(state)}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches copy action correctly on first render', () => {
    const testStore = mockStore(state);
    mount(
      <WidgetTable
        blockName="test1"
        attributeName="layout"
        eventHandler={() => {}}
        setFlag={() => {}}
        store={testStore}
      />
    );
    expect(testStore.getActions().length).toEqual(1);
    expect(testStore.getActions()[0]).toEqual(
      malcolmCopyValue(['test1', 'layout'])
    );
  });

  it('dispatches submit action on change', () => {
    const testStore = mockStore(state);
    const wrapper = mount(
      <WidgetTable
        blockName="test1"
        attributeName="layout"
        eventHandler={() => {}}
        setFlag={() => {}}
        store={testStore}
      />
    );
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'test' } });
    expect(testStore.getActions().length).toEqual(2);
    expect(testStore.getActions()[1]).toEqual(
      malcolmUpdateTable(
        ['test1', 'layout'],
        {
          mri: 'PANDA:TTLIN1',
          name: 'TTLIN1',
          visible: false,
          x: 'test',
          y: 0,
        },
        0
      )
    );
  });

  it('dispatches set flag on textinput focus', () => {
    const testStore = mockStore(state);
    const wrapper = mount(
      <WidgetTable
        blockName="test1"
        attributeName="layout"
        eventHandler={() => {}}
        setFlag={() => {}}
        store={testStore}
      />
    );
    wrapper
      .find('input')
      .first()
      .simulate('focus');

    expect(testStore.getActions().length).toEqual(2);
    expect(testStore.getActions()[1]).toEqual(
      malcolmSetTableFlag({ column: 2, label: 'x', row: 0 }, 'dirty', true)
    );
  });

  it('revert button hooks up correctly', () => {
    const testStore = mockStore(state);
    const wrapper = mount(
      <WidgetTable blockName="test1" attributeName="layout" store={testStore} />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(testStore.getActions().length).toEqual(2);
    expect(testStore.getActions()[1]).toEqual(
      malcolmCopyValue(['test1', 'layout'])
    );
  });

  it('submit button hooks up correctly', () => {
    state.malcolm.blocks.test1.attributes[0].localState = {
      value: JSON.parse(JSON.stringify(harderAttribute.value)),
    };
    const testStore = mockStore(state);
    const wrapper = mount(
      <WidgetTable blockName="test1" attributeName="layout" store={testStore} />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');
    expect(testStore.getActions().length).toEqual(2);
    expect(testStore.getActions()[0]).toEqual(
      malcolmSetFlag(['test1', 'layout'], 'pending', true)
    );
    expect(testStore.getActions()[1]).toEqual(
      malcolmPutAction(['test1', 'layout'], harderAttribute.value)
    );
  });
});
