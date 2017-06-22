/**
 * Created by Ian Gillingham on 15/05/17.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import 'font-awesome/scss/font-awesome.scss';
import 'material-design-icons/iconfont/material-icons.css';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
//import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
//import navbarActions, {NavbarEventInfo} from '../actions/navbarActions';

const deleteIcon = <FontIcon className="material-icons">{"delete"}</FontIcon>;
const addIcon    = <FontIcon className="material-icons">{"add"}</FontIcon>;
const menuIcon   = <FontIcon className="material-icons">{"menu"}</FontIcon>;





export default class ToolsNavbar extends React.Component {

constructor(props)
  {
  super(props);
    this.actionIdName = ["AddBlock","DeleteBlock","Delete Edge","MenuAction"];
  this.state = { selectedIndex: 0, };
  this.__onSelect = this.__onSelect.bind(this);
  }

__onSelect(index)
  {
  console.log(`toolsNavbar: __onSelect()  index = ${index}`);
  this.setState({selectedIndex: index});
    if (index < this.actionIdName.length)
      {
      let actionName = this.actionIdName[index];
      let nbInfo = new NavbarEventInfo(actionName,null);
      navbarActions.userClickedNavbarItem(nbInfo);
      }
  }

render()
  {
  const materialui_bottomBar =
          (
            <Paper zDepth={1}>
              <BottomNavigation selectedIndex={this.state.selectedIndex}>
                <BottomNavigationItem
                  label="Add Block"
                  icon={addIcon}
                  onClick={() => this.__onSelect(0)}
                />
                <BottomNavigationItem
                  label="Delete Block"
                  icon={deleteIcon}
                  onClick={() => this.__onSelect(1)}
                />
                <BottomNavigationItem
                  label="Delete Edge"
                  icon={deleteIcon}
                  onClick={() => this.__onSelect(2)}
                />
                <BottomNavigationItem
                  label="Actions"
                  icon={menuIcon}
                  onClick={() => this.__onSelect(3)}
                />
              </BottomNavigation>
            </Paper>
          );

  return (materialui_bottomBar);
  }
}

ToolsNavbar.propTypes = {};

