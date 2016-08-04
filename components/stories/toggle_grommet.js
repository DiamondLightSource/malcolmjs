/**
 * Created by ig43 on 03/08/16.
 */
import React from 'react';
import hpeTheme from 'grommet-hpe-theme';
import App from 'grommet/components/App';
import Grommet from 'grommet/components/Grommet';
import CheckBox from 'grommet/components/CheckBox';
import { storiesOf, action } from '@kadira/storybook';

function handleToggle(event){

  console.log("Grommet toggle clicked");

}

storiesOf('Toggle', module)
  .add('with text', () => (
    <App>
    <CheckBox id="item2" name="item2" label="Item 2" checked={false} toggle={true} onChange={handleToggle}/>
    <CheckBox id="item3" name="item3" label="Item 3" checked={false} toggle={true} onChange={handleToggle}/>
    </App>

  ))
  .add('with no text', () => (
    <CheckBox id="item3" name="item3" label="Item 3" checked={false} toggle={true} onChange={handleToggle}/>
  ));

