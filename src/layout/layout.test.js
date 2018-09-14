import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Toolkit, DiagramEngine } from 'storm-react-diagrams';
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

jest.useFakeTimers();

describe('Layout', () => {
  let shallow;
  let mockStore;
  let block;
  let node;
  let state;
  let actions;

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
    layoutActions.makeBlockVisible.mockClear();
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

    actions = [];
    mockStore = mockState => ({
      getState: () => mockState,
      dispatch: action => {
        actions.push(action);
      },
      subscribe: () => {},
    });

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
        layoutEngine: new DiagramEngine(),
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

  it('onFocus sets hasFocus state to true', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA:SEQ1'];
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    expect(wrapper.state()).toEqual({ hasFocus: false });
    wrapper.find('#LayoutDiv').simulate('focus');
    expect(wrapper.state()).toEqual({ hasFocus: true });
  });

  it('onBlur sets hasFocus state to false', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA:SEQ1'];
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    expect(wrapper.state()).toEqual({ hasFocus: false });
    wrapper.setState({ hasFocus: true });
    expect(wrapper.state()).toEqual({ hasFocus: true });
    wrapper.find('#LayoutDiv').simulate('blur');
    expect(wrapper.state()).toEqual({ hasFocus: false });
  });

  it('delete key sends delete block action if layout has focus', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA:SEQ1'];
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    wrapper.setState({ hasFocus: true });
    wrapper.find('#LayoutDiv').simulate('keyup', { key: 'Delete' });
    expect(actions.length).toEqual(2);
    console.log(actions);
    expect(layoutActions.makeBlockVisible).toBeCalledWith(
      ['PANDA:SEQ1'],
      [
        {
          x: 0,
          y: 0,
        },
      ],
      [false]
    );
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(1);
    expect(malcolmSelectBlock).toHaveBeenCalledWith('PANDA:SEQ1', false);
  });

  it('backspace key sends delete block action if layout has focus', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA:SEQ1'];
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    wrapper.setState({ hasFocus: true });
    wrapper.find('#LayoutDiv').simulate('keyup', { key: 'Backspace' });
    expect(layoutActions.makeBlockVisible).toBeCalledWith(
      ['PANDA:SEQ1'],
      [
        {
          x: 0,
          y: 0,
        },
      ],
      [false]
    );
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(1);
    expect(malcolmSelectBlock).toHaveBeenCalledWith('PANDA:SEQ1', false);
  });

  it('delete key doesnt send delete block action if layout doesnt have focus', () => {
    state.malcolm.layoutState.selectedBlocks = ['PANDA:SEQ1'];
    const wrapper = shallow(<Layout store={mockStore(state)} />);
    wrapper.setState({ hasFocus: false });
    wrapper.find('#LayoutDiv').simulate('keyup', { key: 'Delete' });
    expect(layoutActions.makeBlockVisible).not.toHaveBeenCalled();
    expect(malcolmSelectBlock).not.toHaveBeenCalled();
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
    jest.runAllTimers();
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
      'block1•output•PANDA:block1•input1',
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

  it('mapDispatchToProps deleteSelected dispatches updates to hide and deselect multiple blocks', () => {
    const props = mapDispatchToProps(() => {});
    state.malcolm.layoutState.selectedBlocks = ['PANDA:block1', 'PANDA:block2'];
    props.deleteSelected();
    console.log('--------');
    console.log(actions);
    expect(layoutActions.makeBlockVisible).toBeCalledWith(
      ['PANDA:block1', 'PANDA:block2'],
      [
        {
          x: 0,
          y: 0,
        },
        {
          x: 0,
          y: 0,
        },
      ],
      [false, false]
    );
    expect(malcolmSelectBlock).toHaveBeenCalledTimes(2);
    expect(malcolmSelectBlock).toHaveBeenCalledWith('PANDA:block1', false);
    expect(malcolmSelectBlock).toHaveBeenCalledWith('PANDA:block2', false);
  });
});
