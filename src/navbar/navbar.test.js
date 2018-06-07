import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import NavBar from './navbar.component';
import { openParentPanelType } from '../viewState/viewState.actions';

const mockStore = configureStore();
const dispatch = jest.fn();

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
            { path: 'PANDA', children: [] },
            { path: 'layout', children: [] },
            { path: 'PANDA:SEQ1', children: [] },
          ],
          rootNav: {
            path: '',
            children: ['PANDA', 'PANDA:SEQ1'],
          },
        },
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <NavBar store={mockStore(state)} dispatch={dispatch} />
    );
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
});
