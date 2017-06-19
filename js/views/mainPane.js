/**
 * Created by twi18192 on 25/08/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import ReactPanels from 'react-panels';
import mainPaneActions from '../actions/mainPaneActions';
import paneActions from '../actions/paneActions';
import ToolsNavbar from './navbarView';


//import ConfigButton from './configButton';
import FavButton from './favButton';
import FooterButton from './button';
import FlowChartControllerView from './flowChartControllerView';

import WasteBin from './wasteBin';
import * as toggleButtonStyles from './toggleButton.css';
let Panel = ReactPanels.Panel;
let Tab = ReactPanels.Tab;
let Toolbar = ReactPanels.Toolbar;
let Content = ReactPanels.Content;
let Footer = ReactPanels.Footer;
let ToggleButton = ReactPanels.ToggleButton;
let Button = ReactPanels.Button;

export default class MainPane extends React.Component
{
constructor(props)
  {
  super(props);
  this.handleActionToggleSidebar = this.handleActionToggleSidebar.bind(this);
  this.handleActionFooterToggle = this.handleActionFooterToggle.bind(this);
  this.handleActionBlockLookupTableTabOpen = this.handleActionBlockLookupTableTabOpen.bind(this);
  this.handleActionDeviceSelect = this.handleActionDeviceSelect.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState){
    return (
      nextProps.footers !== this.props.footers
      //nextProps.favTabOpen !== this.props.favTabOpen ||
      //nextProps.configTabOpen !== this.props.configTabOpen
      //nextProps.loadingInitialData !== this.props.loadingInitialData ||
      //nextProps.loadingInitialDataError !== this.props.loadingInitialDataError
    )
  }

  handleActionFooterToggle(){     /* this is what the footer toggle button needs to call when clicked!!*/
    mainPaneActions.toggleFooter1("this is the item")
  }

  //handleActionFavTabOpen(){
  //  paneActions.favTabOpen("this is the item")
  //},
  //
  //handleActionConfigTabOpen(){
  //  paneActions.configTabOpen('this is the item')
  //},

  handleActionDeviceSelect(){
    paneActions.deviceSelect('select device');
  }

  handleActionBlockLookupTableTabOpen()
    {

    }

  handleActionToggleSidebar(){
    paneActions.toggleSidebar("toggle sidebar");
  }



  render() {
    let TESTStyling = {
      'height': '1000px',
      'width': '1000px',
      //backgroundColor: 'darkmagenta'
    };

    let contentStyling = {
      'height': '1476px',
      'width': '1494px'
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

    let footer =
      <Footer><div id={"blockDock"}>
        <div id={"buttonContainer"}>

          <FooterButton id={"blockLookUpTableButton"}
                        buttonLabel={"Blocks"}
                        buttonClick={this.handleActionBlockLookupTableTabOpen} />
          <FooterButton id={"deviceLookUpTableButton"}
                        buttonLabel={"Devices"}
                        buttonClick={this.handleActionDeviceSelect} />
        </div>
      </div>
      </Footer>;


    return(
      <Panel theme={"flexbox"} useAvailableHeight={true} buttons={[
          <ToggleButton title={"Toggle sidebar"} onClick={this.handleActionToggleSidebar} >
            <i className={"fa fa-bars"}></i>
          </ToggleButton>,
          <ToggleButton title={"Toggle Footer"} onChange={this.handleActionFooterToggle}>
            <i className={"fa fa-wrench"}></i>
          </ToggleButton>
        ]}>
        <Tab title={"Design"} showFooter={this.props.footers} >
          <Content >
            <div style={contentStyling} >
              <FlowChartControllerView/>
            </div>
          </Content>

          {footer}
        </Tab>

        <Tab title={"View"} showFooter={this.props.footers}>
          <Content>{"Secondary main view - graph of position data"} <br/>
            {"Contains a graph of the current position data, also has some buttons at the bottom to launch subscreens"} <br/>
          </Content>
          {footer}
        </Tab>

        <ToolsNavbar/>

      </Panel>
    )
  }
}

MainPane.propTypes = {
footers: PropTypes.bool,
  //favTabOpen: PropTypes.bool,
  //configTabOpen: PropTypes.bool,
  loadingInitialData: PropTypes.bool,
  loadingInitialDataError: PropTypes.bool
};


//<FavButton favTabOpen={this.handleActionFavTabOpen}/>
//<ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
