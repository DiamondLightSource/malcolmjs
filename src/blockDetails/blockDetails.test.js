import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import BlockDetails from './blockDetails.component';

describe('Block Details', () => {
  let shallow;
  let mockStore;
  let state;

  beforeEach(() => {
    shallow = createShallow({
      dive: true,
    });

    mockStore = configureStore();

    state = {
      malcolm: {
        parentBlock: 'test1',
        blocks: {
          test1: {},
        },
      },
    };
  });

  it('renders correctly when loading', () => {
    const block = {
      loading: true,
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders correctly when metadata loaded and waiting for attributes', () => {
    const block = {
      loading: false,
      attributes: [
        { name: 'health', loading: true },
        { name: 'icon', loading: true },
      ],
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders correctly when metadata loaded and attributes loaded', () => {
    const block = {
      loading: false,
      attributes: [
        {
          name: 'health',
          loading: false,
          alarm: { severity: 0 },
          meta: { label: 'health 1' },
        },
        {
          name: 'icon',
          loading: false,
          alarm: { severity: 0 },
          meta: { label: 'icon 1' },
        },
      ],
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });
});
