import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import JSONTree from './jsonTree.component';
import { harderAttribute, expectedCopy } from '../table/table.stories';

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
      <JSONTree
        blockName="test1"
        attributeName="layout"
        putObject={() => {}}
        revertHandler={() => {}}
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  /*
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
  */
  it('revert button hooks up correctly', () => {
    const revertAction = jest.fn();
    const testStore = mockStore(state);
    const wrapper = mount(
      <JSONTree
        blockName="test1"
        attributeName="layout"
        store={testStore}
        revertHandler={revertAction}
        putObject={() => {}}
      />
    );
    const buttons = wrapper.find('button');
    buttons.at(buttons.length - 2).simulate('click');
    expect(revertAction).toHaveBeenCalledTimes(1);
    expect(revertAction).toHaveBeenCalledWith(['test1', 'layout']);
  });

  it('submit button hooks up correctly', () => {
    const putAction = jest.fn();
    const testStore = mockStore(state);
    const wrapper = mount(
      <JSONTree
        blockName="test1"
        attributeName="layout"
        store={testStore}
        revertHandler={() => {}}
        putObject={putAction}
      />
    );
    wrapper
      .find('button')
      .last()
      .simulate('click');

    expect(putAction).toHaveBeenCalledTimes(1);
    expect(putAction).toHaveBeenCalledWith(
      ['test1', 'layout'],
      expectedCopy.value
    );
  });
});
