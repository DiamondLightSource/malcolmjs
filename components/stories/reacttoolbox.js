import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Button } from 'react-toolbox/lib/button';
import { SwitchTest, SwitchTest2 } from '../switchex';


storiesOf('Reacttoolbox', module)
  .add('Toolbox button', () => (
    <Button label='Toolbox Button' onClick={action('clicked')}/>
  ))
  .add('Standard button', () => (
    <button onClick={action('clicked')}>Standard</button>
  ))
  .add('Toolbox switch', () => (
        <SwitchTest />
    ));

