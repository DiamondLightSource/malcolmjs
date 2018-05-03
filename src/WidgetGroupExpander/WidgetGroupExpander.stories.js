import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import WidgetGroupExpander from './WidgetGroupExpander.component';
import WidgetLED from '../widgetLED/widgetLED.component';
import WidgetCheckbox from '../WidgetCheckbox/WidgetCheckbox.component';
import SimpleAttr from './SimpleAttr.component';

storiesOf('GroupExpander', module).add(
  'unchecked',
  withInfo(`
  A simple checkbox for displaying and toggling on/off status; currently turned off.
  `)(() => (
    <WidgetGroupExpander GroupName="Test Group">
      <SimpleAttr name="current_val#1" alarm={0}>
        <WidgetLED
          colorCenter="#5800ff"
          colorBorder="#00ff1b"
          LEDState={false}
        />
      </SimpleAttr>
      <SimpleAttr name="current_val#2" alarm={1}>
        <WidgetLED colorCenter="#0006ff" colorBorder="#ff00d0" LEDState />
      </SimpleAttr>
      <SimpleAttr name="current_val#3" alarm={2}>
        <WidgetCheckbox
          CheckState
          checkEventHandler={() => {}}
          Label="testCheck1"
        />
      </SimpleAttr>
    </WidgetGroupExpander>
  ))
);
