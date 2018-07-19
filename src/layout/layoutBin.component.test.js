import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import LayoutBin from './layoutBin.component';
import {
  MalcolmInLayoutDeleteZoneType,
  MalcolmShowBinType,
} from '../malcolm/malcolm.types';
import layoutAction from '../malcolm/actions/layout.action';

jest.mock('../malcolm/actions/layout.action');

describe('Layout Bin', () => {
  let shallow;
  let mount;
  let store;

  beforeEach(() => {
    layoutAction.deleteBlocks.mockImplementation(() => ({
      type: 'test_delete_blocks',
    }));
    layoutAction.mouseInsideDeleteZone.mockImplementation(inside => ({
      type: MalcolmInLayoutDeleteZoneType,
      payload: { insideZone: inside },
    }));
    layoutAction.showLayoutBin.mockImplementation(show => ({
      type: MalcolmShowBinType,
      payload: { visible: show },
    }));

    shallow = createShallow({ dive: true });
    mount = createMount();
    const state = {};
    store = configureStore()(state);
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LayoutBin store={store} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('notifies when inside delete zone', () => {
    const wrapper = mount(<LayoutBin store={store} />);

    wrapper.find('div').simulate('mouseEnter');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(MalcolmInLayoutDeleteZoneType);
    expect(actions[0].payload.insideZone).toBeTruthy();
  });

  it('notifies when leaving delete zone', () => {
    const wrapper = mount(<LayoutBin store={store} />);

    wrapper.find('div').simulate('mouseLeave');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(MalcolmInLayoutDeleteZoneType);
    expect(actions[0].payload.insideZone).toBeFalsy();
  });

  it('stops showing bin and deletes blocks when blocks are dropped on it', () => {
    const wrapper = mount(<LayoutBin store={store} />);

    wrapper.find('div').simulate('mouseUp');

    const actions = store.getActions();
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toEqual(MalcolmShowBinType);
    expect(actions[0].payload.visible).toBeFalsy();

    expect(actions[1].type).toEqual('test_delete_blocks');
  });
});
