import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import AttributeDetails, {
  AttributeDetailsComponent,
} from './attributeDetails.component';

const description = alarmState =>
  `A container for displaying attributes, the alarm is in the state ${alarmState}`;

const generateInfo = alarmState => ({
  text: description(alarmState),
  propTables: [AttributeDetailsComponent],
  propTablesExclude: [AttributeDetails],
});

const attribute = alarmStateValue => ({
  name: 'attribute 1',
  alarm: {
    severity: alarmStateValue,
  },
});

const generateComponent = alarmStateValue => (
  <AttributeDetails attribute={attribute(alarmStateValue)}>
    <div>Hello</div>
  </AttributeDetails>
);

storiesOf('Attribute Details', module)
  .add('info', withInfo(generateInfo('INFO'))(() => generateComponent(0)))
  .add('warning', withInfo(generateInfo('WARNING'))(() => generateComponent(1)))
  .add('error', withInfo(generateInfo('ERROR'))(() => generateComponent(2)))
  .add('invalid', withInfo(generateInfo('INVALID'))(() => generateComponent(3)))
  .add(
    'undefined',
    withInfo(generateInfo('UNDEFINED'))(() => generateComponent(4))
  );
