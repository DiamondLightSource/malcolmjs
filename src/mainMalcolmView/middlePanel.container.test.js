import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MiddlePanel from './middlePanel.container';

describe('MalcolmMiddlePanel', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const state = {
      malcolm: {
        parentBlock: 'test1',
        mainAttribute: 'layout',
        layout: {
          blocks: [],
        },
      },
      viewState: {
        openParentPanel: true,
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders a container only if the mainAttribute is not layout', () => {
    const state = {
      malcolm: {
        mainAttribute: 'health',
        layout: {
          blocks: [],
        },
      },
      viewState: {
        openParentPanel: true,
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
