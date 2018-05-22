import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import configureStore from 'redux-mock-store';
import NavBar from './navbar.component';

const mockStore = configureStore();
const dispatch = jest.fn();

describe('NavBar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const state = {
      viewState: {
        openParentPanel: true,
        openChildPanel: true,
      },
      malcolm: {
        navigation: ['PANDA', 'layout', 'PANDA:SEQ1'],
      },
    };

    const wrapper = shallow(
      <NavBar store={mockStore(state)} dispatch={dispatch} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
