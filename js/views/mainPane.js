/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');

var mainPaneActions = require('../actions/mainPaneActions');
var paneActions = require('../actions/paneActions');

var ConfigButton = require('./configButton');
var FavButton = require('./favButton');
var FooterButton = require('./button');
var FlowChartControllerView = require('./flowChartControllerView');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var MainPane = React.createClass({

  propTypes: {
    footers: React.PropTypes.bool,
    //favTabOpen: React.PropTypes.bool,
    //configTabOpen: React.PropTypes.bool,
    loadingInitialData: React.PropTypes.bool,
    loadingInitialDataError: React.PropTypes.bool
  },

  shouldComponentUpdate(nextProps, nextState){
    return (
      nextProps.footers !== this.props.footers
      //nextProps.favTabOpen !== this.props.favTabOpen ||
      //nextProps.configTabOpen !== this.props.configTabOpen
      //nextProps.loadingInitialData !== this.props.loadingInitialData ||
      //nextProps.loadingInitialDataError !== this.props.loadingInitialDataError
    )
  },

  handleActionFooterToggle: function(){     /* this is what the footer toggle button needs to call when clicked!!*/
    mainPaneActions.toggleFooter1("this is the item")
  },

  //handleActionFavTabOpen: function(){
  //  paneActions.favTabOpen("this is the item")
  //},
  //
  //handleActionConfigTabOpen: function(){
  //  paneActions.configTabOpen('this is the item')
  //},

  handleActionDeviceSelect: function(){
    paneActions.deviceSelect('select device');
  },

  handleActionToggleSidebar: function(){
    paneActions.toggleSidebar("toggle sidebar");
  },

  render: function() {
    console.log("render: mainPane");
    var TESTStyling = {
      height: 1000,
      width: 1000,
      //backgroundColor: 'darkmagenta'
    };

    var contentStyling = {
      'height': '1476 px',
      'width': '1494 px'
    };

    /* Using an if statement to check if we need to display the initial data fetch loading icon
    instead of flowChart
     */
    /* UPDATE: Don't use a loading screen for now */

    //var mainPaneContent;
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

    var footer =
      <Footer><div id="blockDock">
        <div id="buttonContainer">

          <FooterButton id="blockLookUpTableButton"
                        buttonLabel="Blocks"
                        buttonClick={this.handleActionBlockLookupTableTabOpen} />
          <FooterButton id="deviceLookUpTableButton"
                        buttonLabel="Devices"
                        buttonClick={this.handleActionDeviceSelect} />
        </div>
      </div>
      </Footer>;

    return(
      <Panel theme="flexbox" useAvailableHeight={true} buttons={[
          <ToggleButton title="Toggle sidebar" onClick={this.handleActionToggleSidebar} >
            <i className="fa fa-bars"></i>
          </ToggleButton>,
          <ToggleButton title="Toggle Footer" onChange={this.handleActionFooterToggle}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>
        ]}>
        <Tab title="Design" showFooter={this.props.footers} >
          <Content >
            <div style={contentStyling} >
              <FlowChartControllerView/>
            </div>
          </Content>

          {footer}
        </Tab>

        <Tab title="View" showFooter={this.props.footers}>
          <Content>Secondary main view - graph of position data <br/>
            Contains a graph of the current position data, also has some buttons at the bottom to launch subscreens <br/>

          </Content>
          {footer}
        </Tab>
      </Panel>
    )
  }
});

module.exports = MainPane;

//<FavButton favTabOpen={this.handleActionFavTabOpen}/>
//<ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
