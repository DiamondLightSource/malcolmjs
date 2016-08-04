/**
 * Created by ig43 on 03/08/16.
 */
import React from 'react';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import { storiesOf, action } from '@kadira/storybook';
import './index.scss';

function handleToggle(event){

  console.log("Grommet toggle clicked");

}

storiesOf('ListGrommet', module)
  .add('with text', () => (
    <List selectable={true} selected={2} onSelect={action("List item selected")}>
      <ListItem justify="between">
    <span>
      Alan
    </span>
        <span className="secondary">
      happy
    </span>
      </ListItem>
      <ListItem justify="between">
    <span>
      Chris
    </span>
        <span className="secondary">
      cool
    </span>
      </ListItem>
      <ListItem justify="between">
    <span>
      Eric
    </span>
        <span className="secondary">
      odd
    </span>
      </ListItem>
    </List>
  ));

