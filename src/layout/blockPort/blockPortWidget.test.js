import React from 'react';
import configureStore from 'redux-mock-store';
import { createShallow } from '@material-ui/core/test-utils';
import BlockPortWidget from './blockPortWidget.component';

describe('BlockPortWidget', () => {
  let shallow;
  let mockStore;
  let port;
  let state;

  const theme = {
    portColours: {
      bool: {
        500: 'blue',
      },
    },
  };

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mockStore = configureStore();

    port = {
      name: 'val1',
      in: true,
      label: 'val 1',
      portType: 'bool',
      getParent: () => ({
        getID: () => '123456',
      }),
    };

    state = {
      malcolm: {
        layoutState: {},
        layoutEngine: {
          diagramModel: {
            nodes: {
              node1: {
                ports: {
                  val1: port,
                },
              },
            },
          },
        },
      },
    };
  });

  it('input port renders correctly', () => {
    port.in = true;

    const wrapper = shallow(
      <BlockPortWidget
        nodeId="node1"
        portId="val1"
        store={mockStore(state)}
        theme={theme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('input port renders correctly with hidden link', () => {
    port.in = true;
    port.hiddenLink = true;
    port.value = 'HIDDEN_BLOCK.VAL';

    const wrapper = shallow(
      <BlockPortWidget
        nodeId="node1"
        portId="val1"
        store={mockStore(state)}
        theme={theme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('output port renders correctly', () => {
    port.in = false;

    const wrapper = shallow(
      <BlockPortWidget
        nodeId="node1"
        portId="val1"
        store={mockStore(state)}
        theme={theme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('output port renders correctly with hidden link', () => {
    port.in = false;
    port.hiddenLink = true;
    port.value = 'HIDDEN_BLOCK.VAL';

    const wrapper = shallow(
      <BlockPortWidget
        nodeId="node1"
        portId="val1"
        store={mockStore(state)}
        theme={theme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
