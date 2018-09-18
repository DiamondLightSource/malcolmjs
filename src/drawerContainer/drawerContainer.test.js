import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DrawerContainer from './drawerContainer.component';
import { openParentPanelType } from '../viewState/viewState.actions';
import navigationActions from '../malcolm/actions/navigation.actions';
import NavTypes from '../malcolm/NavTypes';

jest.mock('../malcolm/actions/navigation.actions');
const mockStore = configureStore();

describe('DrawerContainer', () => {
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
        footerHeight: 10,
      },
      malcolm: {
        blocks: {},
        childBlock: 'CHILD',
        navigation: {
          navigationLists: [
            { path: 'PANDA', navType: NavTypes.Block, children: [] },
          ],
          rootNav: { path: '', children: [] },
        },
      },
      router: {
        location: {
          pathname: '/gui/PANDA/layout/CHILD',
        },
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <DrawerContainer
        store={mockStore(state)}
        parentTitle="Parent"
        childTitle="Child"
        popOutAction={() => {}}
      >
        <div>Left</div>
        <div>Middle</div>
        <div>Right</div>
      </DrawerContainer>
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('closeParent calls the close method', () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DrawerContainer
          parentTitle="Parent"
          childTitle="Child"
          popOutAction={() => {}}
        >
          <div>Left</div>
          <div>Middle</div>
          <div>Right</div>
        </DrawerContainer>
      </Provider>
    );

    wrapper
      .find('DrawerHeader')
      .at(0)
      .find('button')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe(openParentPanelType);
    expect(actions[0].openParentPanel).toBeFalsy();
  });

  it('closeChild calls the close method', () => {
    const actions = [];
    const store = {
      getState: () => state,
      dispatch: action => actions.push(action),
      subscribe: () => {},
    };

    const wrapper = mount(
      <Provider store={store}>
        <DrawerContainer
          parentTitle="Parent"
          childTitle="Child"
          popOutAction={() => {}}
        >
          <div>Left</div>
          <div>Middle</div>
          <div>Right</div>
        </DrawerContainer>
      </Provider>
    );

    wrapper
      .find('DrawerHeader')
      .at(1)
      .find('button')
      .at(0)
      .simulate('click');

    expect(actions.length).toEqual(1);
    expect(navigationActions.closeChildPanel).toHaveBeenCalled();
  });
});
