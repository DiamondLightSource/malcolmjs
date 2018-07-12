import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import Palette from './palette.component';

describe('Palette', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({
      dive: true,
    });
  });

  it('renders correctly', () => {
    const tree = shallow(<Palette />);
    expect(tree).toMatchSnapshot();
  });
});
