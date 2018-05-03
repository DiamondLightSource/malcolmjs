import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import blue from 'material-ui/colors/blue';
import WidgetLED from './widgetLED.component';

describe('WidgetLED', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders off', () => {
    const wrapper = shallow(
      <WidgetLED
        LEDState={false}
        colorBorder={blue[300]}
        colorCenter={blue[700]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders on', () => {
    const wrapper = shallow(
      <WidgetLED LEDState colorBorder={blue[300]} colorCenter={blue[700]} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
