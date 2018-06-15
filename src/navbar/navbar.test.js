import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import NavBar from './navbar.component';
import { openParentPanelType } from '../viewState/viewState.actions';

const mockStore = configureStore();

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
              children: ['layout'],
              childrenLabels: ['layout'],
            },
            { path: 'layout', children: [], childrenLabels: [] },
            { path: 'PANDA:SEQ1', children: [], childrenLabels: [] },
          ],
          rootNav: {
            path: '',
            children: ['PANDA', 'PANDA:SEQ1'],
            childrenLabels: ['PANDA', 'PANDA:SEQ1'],
          },
        },
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
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
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(actions[0].payload.args).toEqual(['/gui/PANDA:SEQ1']);
  });

  it('navigating to nav item changes the route', () => {
    const store = mockStore(state);
    const wrapper = mount(<NavBar store={store} />);

    // PANDA drop down
    wrapper
      .find('IconButton')
      .at(2)
      .simulate('click');
    // click on PANDA:SEQ1 in the list of blocks
    wrapper
      .find('MenuItem')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(actions[0].payload.args).toEqual(['/gui/PANDA/layout']);
  });
});
