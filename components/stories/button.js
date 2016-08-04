import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

function handleEdgeDeleteButton(){

  console.log("material-ui button clicked");

}

storiesOf('Button', module)
  .add('with text', () => (
    <button onClick={action('clicked')}>My First Button</button>
  ))
  .add('with no text', () => (
    <button></button>
  ));

