import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import WidgetTable from './table.container';
import { harderAttribute, expectedCopy } from './table.stories';
import {
  malcolmSetFlag,
  // malcolmSetTableFlag,
  malcolmUpdateTable,
  malcolmCopyValue,
  malcolmPutAction,
  malcolmRevertAction,
} from '../../malcolm/malcolmActionCreators';
import navigationActions from '../../malcolm/actions/navigation.actions';
import NavTypes from '../../malcolm/NavTypes';

jest.mock('../../malcolm/actions/navigation.actions');

describe('Table container', () => {
  let shallow;
  let mockStore;
  let state;
  let mount;

  beforeEach(() => {
    navigationActions.navigateToInfo.mockClear();
    navigationActions.navigateToSubElement.mockClear();
    shallow = createShallow({ dive: true });
    mount = createMount();
    mockStore = configureStore();
    state = {
      malcolm: {
        navigation: {
          navigationLists: [
            { path: 'Test', navType: NavTypes.Block, blockMri: 'test1' },
            { path: 'layout', navType: NavTypes.Attribute },
          ],
        },
        blocks: {
          test1: {
            attributes: [{ ...harderAttribute, localState: {} }],
          },
        },
      },
    };
    state.malcolm.blocks.test1.attributes[0].localState = JSON.parse(
      JSON.stringify(expectedCopy)
    );
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
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('dispatches copy action correctly on first render', () => {
    state.malcolm.blocks.test1.attributes[0].localState = undefined;
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
  it('add row button hooks up correctly', () => {
    const testStore = mockStore(state);
    const wrapper = mount(
      <WidgetTable blockName="test1" attributeName="layout" store={testStore} />
    );
    const buttons = wrapper.find('button');
    buttons.at(buttons.length - 3).simulate('click');
    expect(testStore.getActions().length).toEqual(1);
    expect(testStore.getActions()[0]).toEqual(
      malcolmUpdateTable(
        ['test1', 'layout'],
        { insertRow: true },
        expectedCopy.value.length
      )
    );
  });

  it('revert button hooks up correctly', () => {
    const dispatch = [];
    const thunkTest = [[], []];
    const pushTo = queue => action => {
      queue.push(action);
    };
    const testStore = {
      getState: () => state,
      dispatch: pushTo(dispatch),
      subscribe: () => {},
    };
    const wrapper = mount(
      <WidgetTable blockName="test1" attributeName="layout" store={testStore} />
    );
    const buttons = wrapper.find('button');
    buttons.at(buttons.length - 2).simulate('click');
    expect(dispatch.length).toEqual(2);
    expect(dispatch[1]).toBeInstanceOf(Function);
    dispatch[1](pushTo(thunkTest[0]));
    malcolmRevertAction(['test1', 'layout'])(pushTo(thunkTest[1]));
    expect(thunkTest[0]).toEqual(thunkTest[1]);
    expect(navigationActions.navigateToSubElement).toHaveBeenCalledTimes(1);
    expect(navigationActions.navigateToSubElement).toHaveBeenCalledWith(
      'test1',
      'layout',
      undefined
    );
  });

  it('submit button hooks up correctly', () => {
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
    const expectedSent = harderAttribute.raw.value;
    delete expectedSent.typeid;
    expect(testStore.getActions()[1]).toEqual(
      malcolmPutAction(['test1', 'layout'], expectedSent)
    );
  });
  it('subelement in url selects row correctly', () => {
    state.malcolm.navigation.navigationLists[1].subElements = ['row', '1'];
    state.malcolm.blocks.test1.attributes[0].raw.meta.tags = ['widget:table'];
    const testStore = {
      getState: () => state,
      dispatch: () => {},
      subscribe: () => {},
    };
    const wrapper = shallow(
      <WidgetTable blockName="test1" attributeName="layout" store={testStore} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
