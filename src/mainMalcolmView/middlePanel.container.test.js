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
        blocks: {
          test1: {
            name: 'Test main view',
            attributes: [
              {
                name: 'layout',
                layout: {
                  blocks: [
                    {
                      name: 'counter 1',
                      mri: 'block2',
                      visible: 'true',
                      position: {
                        x: 0,
                        y: 0,
                      },
                    },
                  ],
                },
              },
            ],
          },
          block2: {
            name: 'block2',
            attributes: [
              {
                name: 'in1',
                mri: 'in1',
                meta: {
                  tags: ['inport:bool'],
                },
              },
              {
                name: 'out1',
                mri: 'out1',
                meta: {
                  tags: ['outport:bool'],
                },
              },
              {
                name: 'icon',
                mri: 'icon',
                value: 'icon svg',
                meta: {
                  tags: ['widget:icon'],
                },
              },
            ],
          },
        },
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
        blocks: {},
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MiddlePanel store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
