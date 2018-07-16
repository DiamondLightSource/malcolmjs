import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Toolkit } from 'storm-react-diagrams';
import configureStore from 'redux-mock-store';
import Layout, { mapDispatchToProps } from './layout.component';
import {
  malcolmSelectBlock,
  malcolmLayoutUpdatePosition,
  malcolmLayoutShiftIsPressed,
} from '../malcolm/malcolmActionCreators';
import navigationActions from '../malcolm/actions/navigation.actions';

jest.mock('../malcolm/malcolmActionCreators');
jest.mock('../malcolm/actions/navigation.actions');

describe('Layout', () => {
  let shallow;
  let mockStore;
  let block;
  let node;
  let state;

  Toolkit.TESTING = true;

  const icon =
    '<svg height="100" width="100">' +
    '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />' +
    '</svg>';

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    malcolmSelectBlock.mockClear();
    malcolmLayoutUpdatePosition.mockClear();
    malcolmLayoutShiftIsPressed.mockClear();
    navigationActions.updateChildPanel.mockClear();

    block = {
      name: 'block 1',
      mri: 'block1',
      description: 'block 1 description',
      icon,
      ports: [
        { label: 'in 1', input: true },
        { label: 'out 1', input: false },
        { label: 'out 2', input: false },
      ],
      position: {
        x: 100,
        y: 200,
      },
    };

    mockStore = configureStore();

    node = {
      x: 0,
      y: 0,
    };

    state = {
      malcolm: {
        layout: {
          blocks: [block],
        },
        layoutState: {
          shiftIsPressed: false,
          selectedBlocks: [],
        },
        layoutEngine: {
          testEngine: true,
        },
      },
      router: {
        location: {
          pathname: '/gui/PANDA/layout/PANDA:SEQ1',
        },
      },
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('mapDispatchToProps clickHandler updates position when move is more than 3px', () => {
    const props = mapDispatchToProps(() => {});
    props.clickHandler(block, node);
    expect(malcolmLayoutUpdatePosition).toHaveBeenCalledTimes(1);

    malcolmLayoutUpdatePosition.mockClear();
    props.clickHandler(block, { x: 101, y: 199 });
    expect(malcolmLayoutUpdatePosition).toHaveBeenCalledTimes(0);
  });

  it('mapDispatchToProps clickHandler selects the block as the child panel', () => {
    const props = mapDispatchToProps(() => {});
    props.clickHandler(block, node);
    expect(navigationActions.updateChildPanel).toHaveBeenCalledTimes(1);
  });
});
