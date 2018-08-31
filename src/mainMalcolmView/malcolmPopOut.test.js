import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MalcolmPopOut from './malcolmPopOut.container';
import NavTypes from '../malcolm/NavTypes';

describe('MalcolmPopOut', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly for block', () => {
    const state = {
      malcolm: {
        parentBlock: 'test1',
        blocks: {
          test1: {
            name: 'Test main view',
          },
        },
        navigation: {
          navigationLists: [{ path: 'test1', navType: NavTypes.Block }],
        },
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MalcolmPopOut store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for info', () => {
    const state = {
      malcolm: {
        parentBlock: 'test1',
        childBlock: '.info',
        mainAttribute: 'attr1',
        blocks: {
          test1: {
            name: 'Test main view',
          },
        },
        navigation: {
          navigationLists: [
            { path: 'test1', navType: NavTypes.Block },
            { path: 'attr1', navType: NavTypes.Attribute },
            { path: '.info', navType: NavTypes.Info },
          ],
        },
      },
    };

    const mockStore = configureStore();

    const wrapper = shallow(<MalcolmPopOut store={mockStore(state)} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
