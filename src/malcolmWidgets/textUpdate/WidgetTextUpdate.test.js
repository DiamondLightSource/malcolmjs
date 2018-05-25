import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import WidgetTextUpdate from './WidgetTextUpdate.component';

describe('WidgetTextUpdate', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('displays text', () => {
    const wrapper = shallow(<WidgetTextUpdate Text="Hello World" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('displays with units', () => {
    const wrapper = shallow(<WidgetTextUpdate Text="1.21" Units="GW" />);
    expect(wrapper).toMatchSnapshot();
  });
});
