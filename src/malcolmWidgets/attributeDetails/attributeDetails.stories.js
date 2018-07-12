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
  calculated: {
    name: 'attribute 1',
  },
  raw: {
    alarm: {
      severity: alarmStateValue,
    },
    meta: {
      writeable: false,
      typeid: 'malcolm:core/BooleanMeta:1.0',
      label: 'Attribute 1',
      tags: [alarmStateValue === -2 ? 'widget:textinput' : 'widget:led'],
    },
    value: true,
  },
});

const buildState = alarmStateValue => ({
  malcolm: {
    blocks: {
      block1: {
        attributes: [attribute(alarmStateValue)],
      },
    },
  },
});

const generateComponent = alarmStateValue => (
  <Provider store={mockStore(buildState(alarmStateValue))}>
    <AttributeDetails blockName="block1" attributeName="attribute 1">
      <div>Hello</div>
    </AttributeDetails>
  </Provider>
);

storiesOf('Details/Attribute Details', module)
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
  )
  .add('dirty', withInfo(generateInfo('DIRTY'))(() => generateComponent(-2)));
