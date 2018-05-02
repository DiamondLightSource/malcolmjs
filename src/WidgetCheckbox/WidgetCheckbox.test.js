import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import { action } from '@storybook/addon-actions/src/index';
import WidgetCheckbox from './WidgetCheckbox.component';

describe('WidgetCheckbox', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders off', () => {
    const wrapper = shallow(
      <WidgetCheckbox
        CheckState={false}
        checkEventHandler={action('checked')}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders on', () => {
    const wrapper = shallow(
      <WidgetCheckbox CheckState checkEventHandler={action('unchecked')} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
