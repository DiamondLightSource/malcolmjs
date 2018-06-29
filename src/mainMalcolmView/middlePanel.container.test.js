import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MiddlePanel from './middlePanel.container';

describe('MalcolmMiddlePanel', () => {
  let shallow;
  let state;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    state = {
      malcolm: {
        parentBlock: 'test1',
        mainAttribute: 'layout',
        layout: {
          blocks: [],
        },
        blocks: {
          test1: {
            attributes: [
              {
                name: 'layout',
                meta: {
                  tags: ['widget:flowgraph'],
                },
              },
              {
                name: 'health',
                meta: {
                  tags: ['widget:textupdate'],
                },
              },
            ],
          },
        },
      },
      viewState: {
        openParentPanel: true,
      },
    };
  });

  it('renders correctly', () => {
    const mockStore = configureStore();

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders a container only if the mainAttribute is not layout', () => {
    state.malcolm.mainAttribute = 'health';

    const mockStore = configureStore();

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
