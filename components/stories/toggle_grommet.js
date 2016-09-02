/**
 * Created by ig43 on 03/08/16.
 */
import React from 'react';
import hpeTheme from 'grommet-hpe-theme';
import Section from 'grommet/components/Section';
import CheckBox from 'grommet/components/CheckBox';
import { storiesOf, action } from '@kadira/storybook';

function handleToggle(event){

  console.log("Grommet toggle clicked");
  console.log("checkbox changed!", event);
  this.setState({isChecked: event.target.checked});
}

storiesOf('Toggle', module)
  .add('with text', () => (
    <div>
      <Section colorIndex="neutral-2" align="start" size="small" pad={{"horizontal": "small", "vertical": "small", "between": "small"}}>
        <CheckBox id="item2" name="item2" label="Item 2" size='small' checked={true} toggle={true} onChange={handleToggle}/>
        <CheckBox id="item3" name="item3" label="Item 3" checked={false} toggle={true} onChange={handleToggle}/>
      </Section>
    </div>

  ))
  .add('with no text', () => (
    <CheckBox id="item3" name="item3" label="Item 3" size='small' checked={false} toggle={true} onChange={handleToggle} style={{ transform: 'scale(0.6)' }}/>
  ));

