/**
 * Created by twi18192 on 25/08/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

//import ReactPanels from 'react-panels';
import mainPaneActions from '../actions/mainPaneActions';
import paneActions from '../actions/paneActions';
//import ToolsNavbar from './navbarView';

//import ConfigButton from './configButton';
import FavButton from './favButton';
import FooterButton from './button';
import FlowChartControllerView from './flowChartControllerView';

//import * as toggleButtonStyles from './toggleButton.css';

import AppBar from 'react-toolbox/lib/app_bar/AppBar';
import Navigation from 'react-toolbox/lib/navigation/Navigation';
import Link from 'react-toolbox/lib/link/Link';
import WasteBin from './wasteBin';

export default class MainPane extends React.Component {

constructor(props)
  {
  super(props);
  this.handleActionToggleSidebar           = this.handleActionToggleSidebar.bind(this);
  this.handleActionFooterToggle            = this.handleActionFooterToggle.bind(this);
  this.handleActionBlockLookupTableTabOpen = this.handleActionBlockLookupTableTabOpen.bind(this);
  this.handleActionDeviceSelect            = this.handleActionDeviceSelect.bind(this);
  this.handleTabChange                     = this.handleTabChange.bind(this);
  this.state                               =
  {
    index       : 1,
    fixedIndex  : 1,
    inverseIndex: 1
  };

  }

shouldComponentUpdate(nextProps, nextState)
  {
  return (
    true
    //nextProps.footers !== this.props.footers
    //nextProps.favTabOpen !== this.props.favTabOpen ||
    //nextProps.configTabOpen !== this.props.configTabOpen
    //nextProps.loadingInitialData !== this.props.loadingInitialData ||
    //nextProps.loadingInitialDataError !== this.props.loadingInitialDataError
  )
  }

handleTabChange(index)
  {
  this.setState({index});
  }

handleActionFooterToggle()
  {     /* this is what the footer toggle button needs to call when clicked!!*/
  mainPaneActions.toggleFooter1("this is the item")
  }

//handleActionFavTabOpen(){
//  paneActions.favTabOpen("this is the item")
//},
//
//handleActionConfigTabOpen(){
//  paneActions.configTabOpen('this is the item')
//},

handleActionDeviceSelect()
  {
  paneActions.deviceSelect('select device');
  }

handleActionBlockLookupTableTabOpen()
  {

  }

handleActionToggleSidebar()
  {
  paneActions.toggleSidebar("toggle sidebar");
  }


render()
  {
  let TESTStyling = {
    'height': '100%',
    'width' : '100%',
    'flex': '1',
    'overflowY': 'hidden'
    //backgroundColor: 'darkmagenta'
  };

  let contentStyling = {
    'height': '1476px',
    'width' : '1494px'
  };

  /* Using an if statement to check if we need to display the initial data fetch loading icon
   instead of flowChart
   */
  /* UPDATE: Don't use a loading screen for now */

  //let mainPaneContent;
  //
  //if(this.props.loadingInitialData === true){
  //  if(this.props.loadingInitialDataError === false) {
  //    mainPaneContent = <i className="fa fa-spinner fa-spin fa-5x" ></i>
  //  }
  //  else if(this.props.loadingInitialDataError === true){
  //    mainPaneContent = <i className="fa fa-exclamation-circle fa-5x" x="100" ></i>
  //  }
  //}
  //else if(this.props.loadingInitialData === false){
  //  mainPaneContent = <FlowChartControllerView/>
  //}
  //else if(this.props.loadingInitialData === 'Error'){
  //  /* Perhaps have another icon show up if initial data fetch doesn't work? */
  //}



  return (
      <div style={TESTStyling}>
        <WasteBin isOver={false} canDrop={false} connectDropTarget={()=>{}} onDrop={()=>{}} style={{width: "75px", height: "75px"}}/>
        <FlowChartControllerView/>
      </div>
  )
  }
}

MainPane.propTypes = {
  footers                : PropTypes.bool,
  //favTabOpen: PropTypes.bool,
  //configTabOpen: PropTypes.bool,
  loadingInitialData     : PropTypes.bool,
  loadingInitialDataError: PropTypes.bool
};


//<FavButton favTabOpen={this.handleActionFavTabOpen}/>
//<ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
