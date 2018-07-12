import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MainMalcolmView from './mainMalcolmView.container';

describe('MainMalcolmView', () => {
  let shallow;
  let state;
  let mockStore;

  beforeEach(() => {
    shallow = createShallow({ dive: true });

    state = {
      malcolm: {
        parentBlock: 'test1',
        blocks: {
          test1: {
            name: 'Test main view',
          },
        },
      },
    };

    mockStore = configureStore();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<MainMalcolmView store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders palette if child block is .palette', () => {
    state.malcolm.childBlock = '.palette';
    const wrapper = shallow(<MainMalcolmView store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders info if child block is .info', () => {
    state.malcolm.childBlock = '.info';
    const wrapper = shallow(<MainMalcolmView store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });
});
