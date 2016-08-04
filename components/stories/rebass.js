import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Button, Badge, Switch } from 'rebass'


function handleEdgeDeleteButton(){

  console.log("Rebass button clicked");

}

storiesOf('Rebass', module)
  .add('Rebass button', () => (
    <Button rounded="true" backgroundColor={'#eeee00'} onClick={action('clicked')}>Rebass Button</Button>
  ))
  .add('Standard button', () => (
    <button onClick={action('clicked')}>Standard</button>
  ))
    .add('Rebass switch', () => (
        <Switch checked />
    ));

