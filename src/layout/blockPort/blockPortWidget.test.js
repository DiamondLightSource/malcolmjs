import React from 'react';
import configureStore from 'redux-mock-store';
import { createShallow } from '@material-ui/core/test-utils';
import BlockPortWidget from './blockPortWidget.component';

describe('BlockPortWidget', () => {
  let shallow;
  let mockStore;
  let port;
  let state;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mockStore = configureStore();

    port = {
      name: 'val1',
      in: true,
      label: 'val 1',
      getParent: () => ({
        getID: () => '123456',
      }),
    };

    state = {
      malcolm: {
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
      <BlockPortWidget nodeId="node1" portId="val1" store={mockStore(state)} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('output port renders correctly', () => {
    port.in = false;

    const wrapper = shallow(
      <BlockPortWidget nodeId="node1" portId="val1" store={mockStore(state)} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
