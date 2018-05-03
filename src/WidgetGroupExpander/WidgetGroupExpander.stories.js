import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import Typography from 'material-ui/Typography';

import WidgetGroupExpander from './WidgetGroupExpander.component';
import WidgetLED from '../widgetLED/widgetLED.component';

const simpleAttrLED = on => (
  <div className={{ flexGrow: 1 }}>
    <Typography>Test widget:</Typography>
    <WidgetLED LEDState={on} colorBorder="#0065ff" colorCenter="#ff16bf" />
  </div>
);

storiesOf('GroupExpander', module).add(
  'unchecked',
  withInfo(`
  A simple checkbox for displaying and toggling on/off status; currently turned off.
  `)(() => (
    <WidgetGroupExpander GroupName="Test Group">
      {simpleAttrLED(false)}
      {simpleAttrLED(true)}
    </WidgetGroupExpander>
  ))
);
