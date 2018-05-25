import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import configureStore from 'redux-mock-store';
import DrawerContainer from './drawerContainer.component';

const mockStore = configureStore();
const dispatch = jest.fn();

describe('DrawerContainer', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correctly', () => {
    const state = {
      viewState: {
        openParentPanel: true,
        openChildPanel: true,
      },
    };

    const wrapper = shallow(
      <DrawerContainer store={mockStore(state)} dispatch={dispatch} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
