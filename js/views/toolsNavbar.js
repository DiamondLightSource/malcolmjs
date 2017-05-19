/**
 * Created by Ian Gillingham on 15/05/17.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import FaBeer from 'react-icons/fa/beer';
import 'font-awesome/scss/font-awesome.scss';
import 'material-design-icons/iconfont/material-icons.css';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const deleteIcon   = <FontIcon className="material-icons">delete</FontIcon>;
const addIcon = <FontIcon className="material-icons">add</FontIcon>;
const menuIcon    = <FontIcon className="material-icons">menu</FontIcon>;

export default class ToolsNavbar extends React.Component {

constructor(props)
  {
  super(props);
  this.state = {
                selectedIndex: 0,
               };

  this.select = (index) => this.setState({selectedIndex: index});

  this.__onClick = this.__onClick.bind(this);
  this.__onFocus = this.__onFocus.bind(this);
  }

__onClick(e)
  {
  console.log("toolsNavbar: __onClick()");
  }

__onFocus(e)
  {
  console.log("toolsNavbar: __onFocus()");
  }

render()
  {
  const navbarInstance = (<div className="btn-toolbar">
    <div className="btn-group">
      <button className="btn" data-original-title="Bold - Ctrl+B"><i className="icon-bold"></i></button>
      <button className="btn" data-original-title="Italic - Ctrl+I"><i className="icon-italic"></i></button>
      <button className="btn" data-original-title="List"><i className="icon-list"></i></button>
      <button className="btn" data-original-title="Img"><i className="icon-picture"></i></button>
      <button className="btn" data-original-title="URL"><i className="icon-arrow-right"></i></button>
    </div>
    <div className="btn-group">
      <button className="btn" data-original-title="Align Right"><i className="icon-align-right"></i></button>
      <button className="btn" data-original-title="Align Center"><i className="icon-align-center"></i></button>
      <button className="btn" data-original-title="Align Left"><i className="icon-align-left"></i></button>
    </div>
    <div className="btn-group">
      <button className="btn" data-original-title="Preview"><i className="icon-eye-open"></i></button>
      <button className="btn" data-original-title="Save"><i className="icon-ok"></i></button>
      <button className="btn" data-original-title="Cancel"><i className="icon-trash"></i></button>
    </div>
  </div>  );

  const toolBar1 = (<div className="btn-toolbar">
    <div className="input-group">
      <div className="input-group-btn">
        <button className="btn" data-original-title="Img"><FaBeer /></button>
        <button className="btn" data-original-title="URL"><i className="icon-arrow-right"></i></button>
      </div>
    </div>
    <div className="input-group">
      <div className="input-group-btn">
        <button className="btn" data-original-title="Preview"><i className="icon-eye-open"></i></button>
        <button className="btn" data-original-title="Save"><i className="icon-ok"></i></button>
        <button className="btn" data-original-title="Cancel"><i className="icon-trash"></i></button>
      </div>
    </div>
  </div>);

  const materialui_bottomBar =
          (
            <Paper zDepth={1}>
              <BottomNavigation selectedIndex={this.state.selectedIndex}>
                <BottomNavigationItem
                  label="Add Block"
                  icon={addIcon}
                  onTouchTap={() => this.select(0)}
                />
                <BottomNavigationItem
                  label="Delete Block"
                  icon={deleteIcon}
                  onTouchTap={() => this.select(1)}
                />
                <BottomNavigationItem
                  label="Actions"
                  icon={menuIcon}
                  onTouchTap={() => this.select(2)}
                />
              </BottomNavigation>
            </Paper>
          );

  return (materialui_bottomBar);
  }
}

ToolsNavbar.propTypes = {};

