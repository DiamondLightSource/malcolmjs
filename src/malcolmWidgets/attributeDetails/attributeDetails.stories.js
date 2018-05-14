import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { withInfo } from '@storybook/addon-info';
import configureStore from 'redux-mock-store';
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

const mockStore = configureStore();

const attribute = alarmStateValue => ({
  name: 'attribute 1',
  alarm: {
    severity: alarmStateValue,
  },
  meta: {
    writeable: false,
    typeid: 'malcolm:core/BooleanMeta:1.0',
    label: 'Val',
    description: 'TTL input value',
    tags: ['group:outputs', 'outport:bool:TTLIN1.VAL', 'widget:led'],
  },
});

const generateComponent = alarmStateValue => (
  <Provider store={mockStore({})}>
    <AttributeDetails attribute={attribute(alarmStateValue)}>
      <div>Hello</div>
    </AttributeDetails>
  </Provider>
);

storiesOf('Attribute Details', module)
  .add('info', withInfo(generateInfo('INFO'))(() => generateComponent(0)))
  .add('warning', withInfo(generateInfo('WARNING'))(() => generateComponent(1)))
  .add('error', withInfo(generateInfo('ERROR'))(() => generateComponent(2)))
  .add('invalid', withInfo(generateInfo('INVALID'))(() => generateComponent(3)))
  .add(
    'undefined',
    withInfo(generateInfo('UNDEFINED'))(() => generateComponent(4))
  )
  .add(
    'pending',
    withInfo(generateInfo('PENDING'))(() => generateComponent(-1))
  );
