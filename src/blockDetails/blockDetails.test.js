import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import configureStore from 'redux-mock-store';
import BlockDetails, { areAttributesTheSame } from './blockDetails.component';

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
        childBlock: 'test1',
        blocks: {
          test1: {},
          '.blocks': {
            children: ['test1'],
          },
        },
        navigation: {
          navigationLists: [],
        },
      },
      viewState: {
        openParentPanel: true,
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

  it('renders correctly when block not found', () => {
    const block = {
      loading: 404,
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders correctly when metadata loaded and waiting for attributes', () => {
    const block = {
      loading: false,
      attributes: [
        { calculated: { name: 'health', loading: true } },
        { calculated: { name: 'icon', loading: true } },
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
          calculated: {
            name: 'health',
            loading: false,
          },
          raw: {
            alarm: { severity: 0 },
            meta: { label: 'health 1' },
          },
        },
        {
          calculated: {
            name: 'icon',
            loading: false,
          },
          raw: {
            alarm: { severity: 0 },
            meta: { label: 'icon 1' },
          },
        },
      ],
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders groups correctly', () => {
    const block = {
      loading: false,
      attributes: [
        {
          calculated: {
            name: 'parameters',
            loading: false,
            isGroup: true,
          },
          raw: {
            alarm: { severity: 0 },
            meta: { label: 'health 1' },
          },
        },
        {
          calculated: {
            name: 'health',
            loading: false,
            inGroup: true,
          },
          raw: {
            alarm: { severity: 0 },
            meta: { label: 'health 1' },
            group: 'parameters',
          },
        },
        {
          calculated: {
            name: 'icon',
            loading: false,
            inGroup: true,
          },
          raw: {
            alarm: { severity: 0 },
            meta: { label: 'icon 1' },
            group: 'parameters',
          },
        },
      ],
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders even if the block is undefined', () => {
    state.malcolm.parentBlock = undefined;

    const tree = shallow(<BlockDetails parent store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  it('renders methods correctly', () => {
    const block = {
      loading: false,
      attributes: [
        {
          calculated: {
            name: 'save',
            loading: false,
            isMethod: true,
            inGroup: false,
          },
          raw: {
            alarm: { severity: 0 },
            label: 'save method',
            takes: {
              elements: {},
            },
            returns: {
              elements: {},
            },
          },
        },
      ],
    };

    state.malcolm.blocks.test1 = block;

    const tree = shallow(<BlockDetails store={mockStore(state)} />);
    expect(tree.dive()).toMatchSnapshot();
  });

  const buildAttributes = updateFunction => {
    const attributes = [
      {
        calculated: {
          name: 'test1',
          inGroup: true,
          isGroup: false,
          isMethod: false,
        },
      },
      {
        calculated: {
          name: 'test2',
        },
      },
    ];

    if (updateFunction) {
      attributes[0] = updateFunction(attributes[0]);
    }

    return attributes;
  };

  it('areAttributesTheSame returns true if length, name, groups and methods are the same', () => {
    const oldAttributes = buildAttributes();
    let newAttributes = buildAttributes();
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeTruthy();

    newAttributes = buildAttributes(a => ({
      ...a,
      calculated: { ...a.calculated, name: 'test1 new' },
    }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({
      ...a,
      calculated: { ...a.calculated, inGroup: false },
    }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({
      ...a,
      calculated: { ...a.calculated, isGroup: true },
    }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({
      ...a,
      calculated: { ...a.calculated, isMethod: true },
    }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();
  });
});
