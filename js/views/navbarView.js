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

const deleteIcon = <FontIcon className="material-icons">{"delete"}</FontIcon>;
const addIcon    = <FontIcon className="material-icons">{"add"}</FontIcon>;
const menuIcon   = <FontIcon className="material-icons">{"menu"}</FontIcon>;





export default class ToolsNavbar extends React.Component {

constructor(props)
  {
  super(props);
  this.state = { selectedIndex: 0, };

  this.__onSelect = this.__onSelect.bind(this);
  }

__onSelect(index)
  {
  console.log(`toolsNavbar: __onSelect()  index = ${index}`);
  this.setState({selectedIndex: index});
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
                  onTouchTap={() => this.__onSelect(0)}
                />
                <BottomNavigationItem
                  label="Delete Block"
                  icon={deleteIcon}
                  onTouchTap={() => this.__onSelect(1)}
                />
                <BottomNavigationItem
                  label="Actions"
                  icon={menuIcon}
                  onTouchTap={() => this.__onSelect(2)}
                />
              </BottomNavigation>
            </Paper>
          );

  return (materialui_bottomBar);
  }
}

ToolsNavbar.propTypes = {};

