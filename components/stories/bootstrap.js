import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from 'react-bootstrap/lib/Button';
import mjButton from './bootstraplocal.css';

function handleEdgeDeleteButton(){

  console.log("bootstrap button clicked");

}

storiesOf('Bootstrap', module)
  .add('Bootstrap button', () => (
    <Button styles={mjButton} onClick={action('clicked')}>Bootstrap Button</Button>
  ))
  .add('Standard button', () => (
    <button onClick={action('clicked')}>Standard</button>
  ));

