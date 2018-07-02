import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MessageSnackBar from './snackbar.component';
import { snackbarState } from '../viewState/viewState.actions';

describe('MessageSnackBar', () => {
  let shallow;
  let mount;
  let mockStore;
  let initialState;
  let testStore;

  beforeEach(() => {
    mockStore = configureStore();
    mount = createMount();
    shallow = createShallow({ dive: true });
  });

  it('renders open', () => {
    initialState = {
      malcolm: {
        snackbar: {
          open: true,
          message: 'TEST',
        },
      },
    };
    testStore = mockStore(initialState);
    const wrapper = shallow(<MessageSnackBar store={testStore} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders hidden', () => {
    initialState = {
      malcolm: {
        snackbar: {
          open: false,
          message: 'TEST',
        },
      },
    };
    testStore = mockStore(initialState);
    const wrapper = shallow(<MessageSnackBar store={testStore} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches close', () => {
    initialState = {
      malcolm: {
        snackbar: {
          open: true,
          message: 'TEST',
        },
      },
    };
    testStore = mockStore(initialState);
    const wrapper = mount(<MessageSnackBar store={testStore} />);
    wrapper.find('button').simulate('click');
    expect(testStore.getActions()[0]).toEqual(snackbarState(false, ''));
  });
});
