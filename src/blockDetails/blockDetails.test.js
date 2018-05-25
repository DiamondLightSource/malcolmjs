import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import BlockDetails from './blockDetails.component';

describe('Block Details', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({
      dive: true,
    });
  });

  it('renders correctly when loading', () => {
    const block = {
      loading: true,
    };

    const tree = shallow(<BlockDetails block={block} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when metadata loaded and waiting for attributes', () => {
    const block = {
      loading: false,
      attributes: [
        { name: 'health', loading: true },
        { name: 'icon', loading: true },
      ],
    };

    const tree = shallow(<BlockDetails block={block} />);
    expect(tree).toMatchSnapshot();
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

    const tree = shallow(<BlockDetails block={block} />);
    expect(tree).toMatchSnapshot();
  });
});
