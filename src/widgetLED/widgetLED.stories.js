import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import blue from 'material-ui/colors/blue';

import WidgetLED from './widgetLED.component';

const LED = on => (
  <WidgetLED LEDState={on} colorBorder={blue[300]} colorCenter={blue[700]} />
);

storiesOf('widgetLED', module)
  .add(
    'turned off',
    withInfo(`
  A simple LED for displaying on/off status; currently turned off.
  `)(() => LED(false))
  )
  .add(
    'turned on',
    withInfo(`
  A simple LED for displaying on/off status; currently turned on.
  `)(() => LED(true))
  );
