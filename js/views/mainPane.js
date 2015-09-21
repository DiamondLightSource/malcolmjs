/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');
var mainPaneStore = require('../stores/mainPaneStore');
var mainPaneActions = require('../actions/mainPaneActions');
var ConfigButton = require('./configButton');
var FavButton = require('./favButton');
var RedBlock = require('./redBlock');
var BlueBlock = require('./blueBlock');
var GreenBlock = require('./greenBlock');

//var SidePane = require('./sidePane');
//var sidePaneActions = require('../actions/sidePaneActions');
//var sidePaneStore = require('../stores/sidePaneStore'); /*not sure if this is allowed, but I'll give it a whirl :P*/

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

function getMainPaneState(){
  return {
    footers: mainPaneStore.getFooterState(),
    configPanelOpen: mainPaneStore.getConfigPanelState(),
    favPanelOpen: mainPaneStore.getFavPanelState(),
    redBlockPropertiesClicked: paneStore.getRedBlockTabClicked(),
    blueBlockPropertiesClicked: paneStore.getBlueBlockTabClicked(),
    greenBlockPropertiesClicked: paneStore.getGreenBlockTabClicked(),
    favTabOpen: paneStore.getFavTabOpen(),
    configTabOpen: paneStore.getConfigTabOpen()
  }
}

var MainPane = React.createClass({

  getInitialState: function(){
    return getMainPaneState(); /* can just return the function that updates state when _onChange runs, rather than retyping the whole thing!*/
  },

  _onChange: function(){
    this.setState(getMainPaneState())
  },

  handleActionFooterToggle: function(){     /* this is what the footer toggle button needs to call when clicked!!*/
    mainPaneActions.toggleFooter1("this is the item")
  },

  handleActionAddTab: function(stuff){
    paneActions.addTab(stuff)
  },

  handleActionRedBlockPropertiesClicked: function(){
    paneActions.redBlockTabOpen("this is the item")
  },

  handleActionBlueBlockPropertiesClicked: function(){
    paneActions.blueBlockTabOpen("this is the item")
  },

  handleActionGreenBlockPropertiesClicked: function(){
    paneActions.greenBlockTabOpen("this is the item")
  },

  handleActionFavTabOpen: function(){
    console.log('favTabOpen is a go');
    paneActions.favTabOpen("this is the item")
  },

  handleActionConfigTabOpen: function(){
    console.log('configTabOpen is a go');
    paneActions.configTabOpen('this is the item')
  },

  //handleActionTabChangeViaOtherMeans: function(tab){
  //  sidePaneActions.switchTabWhenTabOpens(tab)
  //},

  componentDidMount: function(){
    mainPaneStore.addChangeListener(this._onChange);
    paneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    mainPaneStore.removeChangeListener(this._onChange);
    paneStore.removeChangeListener(this._onChange);
  },

  changeClickedObjectProperties: function(selectedObject){
    var selectedObject = selectedObject;
    var selectedDiv = selectedObject.target;
    var selectedDispatchMarker = selectedObject.dispatchMarker;
    console.log(selectedObject);
    console.log(selectedDiv);
    console.log(selectedDispatchMarker);

    switch(selectedDispatchMarker){
      case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.1':
            //this.setState({redBlockPropertiesClicked: true}); /*need a separate handleAction for each block most likely*/
        this.handleActionRedBlockPropertiesClicked();
        //this.handleActionTabChangeViaOtherMeans('Red block');
        var tabToAdd = "RedBlock";
        //sidePaneActions.redBlockTabOpen();
            break;
      case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.2':
            //this.setState({blueBlockPropertiesClicked: true});
        this.handleActionBlueBlockPropertiesClicked();
        //this.handleActionTabChangeViaOtherMeans('Blue block');
        var tabToAdd = "BlueBlock";
            break;
      case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.3':
            //this.setState({greenBlockPropertiesClicked: true});
        this.handleActionGreenBlockPropertiesClicked();
        //this.handleActionTabChangeViaOtherMeans('Green block');
        var tabToAdd = "GreenBlock";
            break;

      default:
            return 'default'
    }

    //this.handleActionAddTab(tabToAdd);

    console.log(tabToAdd);
    //console.log(this.state.redBlockPropertiesClicked);

    //this.setState({objectPropertiesClicked: true});

    //var selectedObjectProperties = redBlock.name; not sure if needed, can access the redBlock object simply through the imported module
    //this.showObjectProperties(selectedObject) /*use it to pass the clicked block object info to the showObjectProperties function*/
  },


  render: function() {
    return(
      <Panel theme="flexbox" useAvailableHeight={true} buttons={[
          <ToggleButton title="Toggle Footer" onChange={this.handleActionFooterToggle}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>
        ]}>
        <Tab title="View" showFooter={this.state.footers}>
          <Content><p>Content of View Tab</p>
            <div id="redBlock" onClick={this.changeClickedObjectProperties}>
            </div>
            <div id="blueBlock" onClick={this.changeClickedObjectProperties}>
            </div>
            <div id="greenBlock" onClick={this.changeClickedObjectProperties}>
            </div>

          <p>
            {(() => {
              var RedBlockInfo = RedBlock.getRedBlockInfo();
              switch (this.state.redBlockPropertiesClicked) {
                case true: return RedBlockInfo;
                case false: return "nada";
                default: return "default";
              }
            })()}
          </p>

            <p>
              {(() => {
                var BlueBlockInfo = BlueBlock.getBlueBlockInfo();
                switch (this.state.blueBlockPropertiesClicked) {
                  case true: return BlueBlockInfo;
                  case false: return "nada";
                  default: return "default";
                }
              })()}
            </p>

            <p>
              {(() => {
                var GreenBlockInfo = GreenBlock.getGreenBlockInfo();
                switch (this.state.greenBlockPropertiesClicked) {
                  case true: return GreenBlockInfo;
                  case false: return "nada";
                  default: return "default";
                }
              })()}
            </p>


          </Content>

          <Footer><div id="blockDock">
            <div id="buttonContainer">
              <FavButton favTabOpen={this.handleActionFavTabOpen}/>
              <ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
            </div>
          </div>
          </Footer>
        </Tab>

        <Tab title="Design" showFooter={this.state.footers}>
          <Content>Secondary main view - graph of position data <br/>
            Contains a graph of the current position data, also has some buttons at the bottom to launch subscreens <br/>
            <p>Config panel is {this.state.configTabOpen ? 'open' : 'closed'}</p>

            <div className={this.state.configTabOpen ? "border" : ""}></div>

            <p>Fav panel is {this.state.favTabOpen ? 'open' : 'closed'}</p>

          </Content>
          <Footer><div id="blockDock">
            <div id="buttonContainer">
              <FavButton favTabOpen={this.handleActionFavTabOpen}/>
              <ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
            </div>
          </div>
          </Footer>
        </Tab>
      </Panel>
    )
  }
});

module.exports = MainPane;

//handleActionChangeRedBlockState: function(){
//  sidePaneActions.redBlockStateChange("this is the item")
//},

//showObjectProperties: function(selectedObject){
//  console.log(selectedObject);
//  var objectProperties = selectedObject; /* currently the div that contains the object, not the actual React component*/
//  console.log("something is happening");
//  if(this.state.redBlockPropertiesClicked === true){
//    console.log("if statement");
//    return objectProperties
//  }
//  else{
//    console.log("else statement");
//    return "uihy"
//  }
//},
