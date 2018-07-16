import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import Palette from './palette.component';

describe('Palette', () => {
  let shallow;
  const mockStore = configureStore();
  let state;

  beforeEach(() => {
    shallow = createShallow({
      dive: true,
    });

    state = {
      malcolm: {
        blocks: {
          parent: {
            attributes: [
              {
                calculated: {
                  name: 'layout',
                  layout: {
                    blocks: [
                      { name: 'block 1', visible: true },
                      { name: 'block 2', mri: 'panda:block2', visible: false },
                    ],
                  },
                },
              },
            ],
          },
        },
        parentBlock: 'parent',
        mainAttribute: 'layout',
      },
    };
  });

  it('renders correctly', () => {
    const tree = shallow(<Palette store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });
});
