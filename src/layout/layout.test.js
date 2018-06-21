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
import { updateChildPanel } from '../viewState/viewState.actions';

jest.mock('../malcolm/malcolmActionCreators');
jest.mock('../viewState/viewState.actions');

describe('Layout', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    malcolmSelectBlock.mockClear();
    malcolmLayoutUpdatePosition.mockClear();
    malcolmLayoutShiftIsPressed.mockClear();
    updateChildPanel.mockClear();
  });

  Toolkit.TESTING = true;

  const icon =
    '<svg height="100" width="100">' +
    '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />' +
    '</svg>';

  const block = {
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

  const mockStore = configureStore();

  const node = {
    x: 0,
    y: 0,
  };

  const state = {
    malcolm: {
      layout: {
        blocks: [block],
      },
      layoutState: {
        shiftIsPressed: false,
        selectedBlocks: [],
      },
    },
    router: {
      location: {
        pathname: '/gui/PANDA/layout/PANDA:SEQ1',
      },
    },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('mapDispatchToProps clickHandler selects a block when clicked', () => {
    const props = mapDispatchToProps(() => {});
    props.clickHandler('url', block, node, []);
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(1);

    malcolmSelectBlock.mockClear();
    props.clickHandler('url', block, node, ['block1']);
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(0);
  });

  it('mapDispatchToProps clickHandler updates position when move is more than 3px', () => {
    const props = mapDispatchToProps(() => {});
    props.clickHandler('url', block, node, []);
    expect(malcolmLayoutUpdatePosition).toHaveBeenCalledTimes(1);

    malcolmLayoutUpdatePosition.mockClear();
    props.clickHandler('url', block, { x: 101, y: 199 }, ['block1']);
    expect(malcolmLayoutUpdatePosition).toHaveBeenCalledTimes(0);
  });

  it('mapDispatchToProps clickHandler selects the block as the child panel if not in url', () => {
    const props = mapDispatchToProps(() => {});
    props.clickHandler('/gui/PANDA/layout/PANDA:SEQ1', block, node, []);
    expect(updateChildPanel).toHaveBeenCalledTimes(1);

    updateChildPanel.mockClear();
    props.clickHandler('/gui/PANDA/layout/block1', block, node, []);
    expect(updateChildPanel).toHaveBeenCalledTimes(0);
  });

  it('mapDispatchToProps shiftKeyHandler signals when shift is clicked', () => {
    const props = mapDispatchToProps(() => {});
    props.shiftKeyHandler(true);
    expect(malcolmLayoutShiftIsPressed).toHaveBeenCalledTimes(1);
  });
});
