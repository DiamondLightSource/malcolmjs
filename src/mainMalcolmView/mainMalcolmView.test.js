import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MainMalcolmView from './mainMalcolmView.container';

describe('MainMalcolmView', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const state = {
      malcolm: {
        parentBlock: 'test1',
        blocks: {
          test1: {
            name: 'Test main view',
          },
        },
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MainMalcolmView store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });
});
