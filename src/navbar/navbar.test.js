import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import NavBar from './navbar.component';
import { openParentPanelType } from '../viewState/viewState.actions';
import navigationActions from '../malcolm/actions/navigation.actions';

const mockStore = state => {
  const actions = [];
  return {
    getState: () => state,
    dispatch: action => actions.push(action),
    subscribe: () => {},
    getActions: () => actions,
  };
};

describe('NavBar', () => {
  let shallow;
  let mount;
  let state;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();

    state = {
      viewState: {
        openParentPanel: true,
        openChildPanel: true,
      },
      malcolm: {
        blocks: {},
        navigation: {
          navigationLists: [
            {
              path: 'PANDA',
              basePath: '/PANDA/',
              children: { layout: { label: 'layout' } },
            },
            {
              path: 'layout',
              children: { SEQ1: { label: 'Test layout child #1' } },
              basePath: '/PANDA/layout/',
            },
            {
              path: 'PANDA:SEQ1',
              children: { Val: { label: 'Value' } },
              basePath: '/PANDA/layout/SEQ1/',
            },
          ],
          rootNav: {
            path: '',
            children: {
              PANDA: { label: 'PANDA' },
              'PANDA:SEQ1': { label: 'PANDA:SEQ1' },
            },
            basePath: '/',
          },
        },
      },
    };
    state.malcolm.navigation.navigationLists[0].parent =
      state.malcolm.navigation.rootNav;
    state.malcolm.navigation.navigationLists.slice(1).forEach((nav, index) => {
      const navCopy = nav;
      navCopy.parent = state.malcolm.navigation.navigationLists[index];
    });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<NavBar store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('hides more icon if last nav element has no children', () => {
    state.malcolm.navigation.navigationLists.slice(-1)[0].children = [];
    const wrapper = shallow(<NavBar store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('shows a select root node message if there is no parent block', () => {
    state.malcolm.navigation.navigationLists = [];
    const wrapper = shallow(<NavBar store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('openParent calls the open method', () => {
    state.viewState.openParentPanel = false;
    const store = mockStore(state);

    const wrapper = mount(<NavBar store={store} />);

    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe(openParentPanelType);
    expect(actions[0].openParentPanel).toBeTruthy();
  });

  it('navigating to .block item changes the route', () => {
    const store = mockStore(state);
    const wrapper = mount(<NavBar store={store} />);

    // .blocks drop down
    wrapper
      .find('IconButton')
      .at(1)
      .simulate('click');
    // click on PANDA:SEQ1 in the list of blocks
    wrapper
      .find('MenuItem')
      .at(1)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(actions[0].payload.args).toEqual([
      { pathname: '/gui/PANDA:SEQ1', search: '' },
    ]);
    expect(actions[1]).toBeInstanceOf(Function);
    const thunkResult = actions[1](store.dispatch, store.getState);
    expect(thunkResult).toEqual(
      navigationActions.subscribeToChildren()(store.dispatch, store.getState)
    );
  });

  it('navigating to nav item changes the route', () => {
    const store = mockStore(state);
    const wrapper = mount(<NavBar store={store} />);

    // PANDA drop down
    wrapper
      .find('IconButton')
      .at(2)
      .simulate('click');
    // click on SEQ1 in the list of blocks layout
    wrapper
      .find('MenuItem')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(actions[0].payload.args).toEqual([
      { pathname: '/gui/PANDA/layout', search: '' },
    ]);
    expect(actions[1]).toBeInstanceOf(Function);
    const thunkResult = actions[1](store.dispatch, store.getState);
    expect(thunkResult).toEqual(
      navigationActions.subscribeToChildren()(store.dispatch, store.getState)
    );
  });

  it('navigating to new parent block item changes the route', () => {
    const store = mockStore(state);
    const wrapper = mount(<NavBar store={store} />);

    // PANDA drop down
    wrapper
      .find('IconButton')
      .at(4)
      .simulate('click');
    // click on Val in the list of SEQ1's fields
    wrapper
      .find('MenuItem')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(actions[0].payload.args).toEqual([
      { pathname: '/gui/PANDA/layout/SEQ1/Val', search: '' },
    ]);
    expect(actions[1]).toBeInstanceOf(Function);
    const thunkResult = actions[1](store.dispatch, store.getState);
    expect(thunkResult).toEqual(
      navigationActions.subscribeToChildren()(store.dispatch, store.getState)
    );
  });
});
