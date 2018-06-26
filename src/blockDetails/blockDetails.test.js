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

  it('renders groups correctly', () => {
    const block = {
      loading: false,
      attributes: [
        {
          name: 'parameters',
          loading: false,
          alarm: { severity: 0 },
          meta: { label: 'health 1' },
          isGroup: true,
        },
        {
          name: 'health',
          loading: false,
          alarm: { severity: 0 },
          meta: { label: 'health 1' },
          group: 'parameters',
          inGroup: true,
        },
        {
          name: 'icon',
          loading: false,
          alarm: { severity: 0 },
          meta: { label: 'icon 1' },
          group: 'parameters',
          inGroup: true,
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
          name: 'save',
          loading: false,
          alarm: { severity: 0 },
          label: 'save method',
          isMethod: true,
          inGroup: false,
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
        name: 'test1',
        inGroup: true,
        isGroup: false,
        isMethod: false,
      },
      {
        name: 'test2',
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

    newAttributes = buildAttributes(a => ({ ...a, name: 'test1 new' }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({ ...a, inGroup: false }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({ ...a, isGroup: true }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();

    newAttributes = buildAttributes(a => ({ ...a, isMethod: true }));
    expect(areAttributesTheSame(oldAttributes, newAttributes)).toBeFalsy();
  });
});
