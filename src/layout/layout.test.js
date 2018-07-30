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
import layoutActions from '../malcolm/actions/layout.action';

jest.mock('../malcolm/malcolmActionCreators');
jest.mock('../malcolm/actions/navigation.actions');
jest.mock('../malcolm/actions/layout.action');

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
    navigationActions.updateChildPanelWithLink.mockClear();

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

  it('mapDispatchToProps mouseDownHandler shows bin', () => {
    const props = mapDispatchToProps(() => {});
    props.mouseDownHandler(true);
    expect(layoutActions.showLayoutBin).toHaveBeenCalledTimes(1);
  });

  it('mapDispatchToProps selectHandler notifies when a block is selected', () => {
    const props = mapDispatchToProps(() => {});
    props.selectHandler('malcolmjsblock', 'PANDA:block1', true);
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(1);
  });

  it('mapDispatchToProps selectHandler notifies when a link is selected', () => {
    const props = mapDispatchToProps(() => {});
    props.selectHandler(
      'malcolmlink',
      'block1-output-PANDA:block1-input1',
      true
    );
    expect(navigationActions.updateChildPanelWithLink).toBeCalledWith(
      'PANDA:block1',
      'input1'
    );
  });

  it('mapDispatchToProps portMouseDown selects a port', () => {
    const props = mapDispatchToProps(() => {});
    props.portMouseDown('port1', true);
    // eslint-disable-next-line import/no-named-as-default-member
    expect(layoutActions.selectPort).toHaveBeenCalledTimes(1);
  });

  it('mapDispatchToProps makeBlockVisible dispatches updates to make a block visible', () => {
    const props = mapDispatchToProps(() => {});
    const event = {
      dataTransfer: {
        getData: () => 'PANDA:block1',
      },
    };

    const engine = {
      getRelativeMousePoint: () => ({
        x: 100,
        y: 200,
      }),
    };

    props.makeBlockVisible(event, engine);
    expect(layoutActions.makeBlockVisible).toBeCalledWith('PANDA:block1', {
      x: 100,
      y: 200,
    });
  });
});
