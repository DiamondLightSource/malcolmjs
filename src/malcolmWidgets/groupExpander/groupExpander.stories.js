import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import WidgetGroupExpander, {
  GroupExpanderComponent,
} from './groupExpander.component';

const attributeStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: 5,
  width: '100%',
  margin: 2,
};

const buildExpanderGroup = expanded => (
  <WidgetGroupExpander groupName="Test Group" expanded={expanded}>
    <div style={attributeStyle}>Attribute 1</div>
    <div style={attributeStyle}>Attribute 2</div>
    <div style={attributeStyle}>Attribute 3</div>
  </WidgetGroupExpander>
);

storiesOf('GroupExpander', module).add(
  'default open',
  withInfo({
    text: `
      A simple checkbox for displaying and toggling on/off status; currently turned off.
      `,
    propTables: [GroupExpanderComponent],
    propTablesExclude: [WidgetGroupExpander],
  })(() => buildExpanderGroup(true))
);
