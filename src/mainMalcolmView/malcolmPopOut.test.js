import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MalcolmPopOut from './malcolmPopOut.container';

describe('MalcolmPopOut', () => {
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

    const wrapper = shallow(<MalcolmPopOut store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
