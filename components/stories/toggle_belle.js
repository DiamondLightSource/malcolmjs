/**
 * Created by ig43 on 03/08/16.
 */
import React from 'react';
let belle = require('belle');
let Toggle = belle.Toggle;
let Choice = belle.Choice;
//import Toggle from 'belle';
import { storiesOf, action } from '@kadira/storybook';

function handleToggle(event){

  console.log("Belle toggle clicked");
  console.log("checkbox changed!", event);
  this.setState({isChecked: event.target.checked});
}

storiesOf('Toggle Belle', module)
  .add('with text', () => (
    <div>
      <Toggle defaultValue
              firstChoiceStyle={Object.assign({}, belle.style.toggle.firstChoiceStyle, { backgroundColor: 'rgba(127, 255, 127, 0.8)', color: 'rgba(0, 0, 255, 1.0)'})}
              style={Object.assign({}, belle.style.toggle.style, { transform: 'scale(0.6)'})}
              sliderStyle={Object.assign({}, belle.style.toggle.sliderStyle)}
              handleStyle={Object.assign({}, belle.style.toggle.handleStyle, {backgroundColor: 'rgba(127, 127, 200, 1.0)'})}
              secondChoiceStyle={Object.assign({}, belle.style.toggle.secondChoiceStyle, { backgroundColor: 'rgba(127, 127, 127, 1.0)' })}>
        <Choice value>On</Choice>
        <Choice value={ false }>Off</Choice>
      </Toggle>
    </div>

  ))
  .add('with no text', () => (
    <Toggle style={{ transform: 'scale(0.6)' }} />
  ));

