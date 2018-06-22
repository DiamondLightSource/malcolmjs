import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import MethodComponent, { mapDispatchToProps } from './method.component';
import { malcolmSetFlag } from '../../malcolm/malcolmActionCreators';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';

jest.mock('../../malcolm/malcolmActionCreators');
jest.mock('../../malcolm/actions/method.actions');

describe('Method component', () => {
  malcolmSetFlag.mockClear();
  malcolmUpdateMethodInput.mockClear();

  let shallow;
  let mockStore;
  let mount;
  let state;

  beforeEach(() => {
    mockStore = configureStore();

    state = {
      malcolm: {
        blocks: {
          block1: {
            attributes: [
              {
                name: 'attr1',
                label: 'save method',
                pending: false,
                errorState: false,
                path: ['block1', 'attr1'],
                takes: {
                  elements: {
                    design: {
                      label: 'test led',
                      description: 'test description',
                      tags: ['widget:led'],
                      writable: true,
                    },
                  },
                },
                returns: {
                  elements: {},
                },
                inputs: {},
                outputs: {},
              },
            ],
          },
        },
      },
    };

    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <MethodComponent
        blockName="block1"
        attributeName="attr1"
        store={mockStore(state)}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mapDispatchToProps runMethod sets pending', () => {
    const dispatch = () => {};
    const dispatchProps = mapDispatchToProps(dispatch);

    dispatchProps.runMethod(['path'], {});
    expect(malcolmSetFlag).toHaveBeenCalledTimes(1);
  });

  it('mapDispatchToProps updateInput signals a method input needs updating', () => {
    const dispatch = () => {};
    const dispatchProps = mapDispatchToProps(dispatch);

    dispatchProps.updateInput(['path'], 'name', 'value');
    expect(malcolmUpdateMethodInput).toHaveBeenCalledTimes(1);
  });
});
