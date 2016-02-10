/**
 * Created by twi18192 on 01/09/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');
var sidePaneStore = require('../stores/sidePaneStore');
var sidePaneActions = require('../actions/sidePaneActions');
var Dropdown = require('./dropdownMenu');
//var mainPaneStore = require('../stores/mainPaneStore');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');

var Treeview = require('react-treeview');

function getSidePaneState(){
  return{
    //tabState: paneStore.getTabState(),
    //selectedTabIndex: paneStore.getSelectedTabIndex()
  }
}

var SidePane = React.createClass({

  //getInitialState: function(){
  //  return getSidePaneState();
  //},

  _onChange: function(){
    //this.setState(getSidePaneState());
    //this.refs.panel.setSelectedIndex(this.state.selectedTabIndex, null);
    /* this works, but I'm not convinced that this is the 'Flux' way to do things...
    UPDATE: actually it doesn't work, selected tab content jumps about!*/
  },

  handleActionPassSidePane: function(){
    paneActions.passSidePane(this)
  },

  handleActionAddTab: function(){
    paneActions.addTab("this is the item"); /* this is what the plus button should invoke when clicked */
  },

  handleActionRemoveTab: function(){
    var selectedIndex = this.refs.panel.getSelectedIndex();
    paneActions.removeTab(selectedIndex);
  },

  handleActionTabChangeViaOtherMeans: function(tab){
    console.log(tab);
    paneActions.dropdownMenuSelect(tab, this);
    console.log("action function for changing tab via other means ran correctly");
  },

  handleActionInitialFetchOfBlockData: function(){
    paneActions.initialFetchOfBlockDataFromBlockStore("fetch the initial block data!");
  },
  handleActionRemoveBlockTab: function(){
    var selectedIndex = this.refs.panel.getSelectedIndex();
    paneActions.removeBlockTab(selectedIndex);
  },

  componentDidMount: function(){
    //sidePaneStore.addChangeListener(this._onChange);
    //paneStore.addChangeListener(this._onChange);
    this.handleActionPassSidePane();
    this.handleActionInitialFetchOfBlockData();
    //this.handleActionPassingSidePaneOnMount()
  },

  componentWillUnmount: function(){
    //sidePaneStore.removeChangeListener(this._onChange);
    //paneStore.removeChangeListener(this._onChange);
  },


  render: function () {

    console.log("sidePane rerender");

    var skin = this.props.skin || "default",
      globals = this.props.globals || {};

    //var tabs = this.props.tabState.map(function(item, i){
    //  var tabTitle = item.label;
    //  var tabIndex = i + 1;
    //  var tabContent = function(){
    //    console.log("inside tabContent function now");
    //    var content = [];
    //      //content.push(<p>stuff</p>);
    //
    //      content.push(<br/>);
    //      content.push(<p>{tabTitle}</p>);
    //      for(var attribute in item){
    //        content.push(<p>{attribute}: {String(item[attribute])}</p>)
    //      }
    //    console.log(content);
    //      return content
    //  };
    //  return (
    //    <Tab title={tabTitle}>
    //
    //      <Content>Attributes of {tabTitle} <br/> Tab number {tabIndex}
    //        {tabContent()}
    //      </Content>
    //
    //    </Tab>
    //  );
    //});

    /* A better version of the above tabState .map function to displaythe attributes of a block properly */
    /* Also, try calculating tabState in here directly from allBlockTabInfo & OpenStates */
    //var newerTabState = [];
    //
    //for(var block in this.props.allBlockTabOpenStates){
    //  /* Need a separate check for the config tabs and such... */
    //  if(this.props.allBlockTabOpenStates[block] === true){
    //    newerTabState.push(this.props.allBlockTabInfo[block]);
    //  }
    //  else if(this.props.allBlockTabOpenStates[block] === false){
    //    console.log("block tab wasn't open, s")
    //  }
    //}

    var betterTabs = this.props.tabState.map(function(block, i){
      var tabLabel = block.label;
      var tabIndex = i + 1;

      var betterTabContent = function() {

        var tabContent = [];

        //tabContent.push(<p>x: {block.position.x}</p>);
        //tabContent.push(<p>y: {block.position.y}</p>);
        //tabContent.push(<br/>);

        if(tabLabel === "Favourites" || tabLabel === "Configuration"){
          console.log("we have a favourites tab or configuaration tab");
          var tabTitle = tabLabel;
        }
        else if(block.tabType === 'edge'){
          console.log("we have an edge tab!!");
        }
        else {
          console.log("normal block tab");
          var tabTitle = "Attributes of " + tabLabel;

          tabContent.push(<b>Position</b>);
          tabContent.push(<p>x: {block.position.x}</p>);
          tabContent.push(<p>y: {block.position.y}</p>);

          tabContent.push(<br/>);

          tabContent.push(<b>Inports</b>);
          for (var j = 0; j < block.inports.length; j++) {
            for (var attribute in block.inports[j]) {
              if (attribute !== 'connectedTo') {
                console.log(block);
                console.log(block.inports[j][attribute]);
                tabContent.push(<p>{attribute}: {String(block.inports[j][attribute])}</p>);
              }
              else if (attribute === 'connectedTo') {
                tabContent.push(<p>connectedTo:</p>);
                if (block.inports[j].connectedTo !== null) {
                  //for (var subAttribute in block.inports[j].connectedTo) {
                  tabContent.push(<p>block: {block.inports[j].connectedTo.block}</p>);
                  tabContent.push(<p>port: {block.inports[j].connectedTo.port}</p>);
                  //}
                }
                else if (block.inports[j].connectedTo === null) {
                  tabContent.push(<p>null</p>);
                }
              }
            }
            //tabContent.push(<p>, </p>);
          }
          tabContent.push(<br/>);

          console.log(tabContent);

          tabContent.push(<b>Outports</b>);
          for (var k = 0; k < block.outports.length; k++) {
            /* connectedTo for an outport is an array, so have to iterate through an array rather than using a for in loop */
            for (var attribute in block.outports[k]) {
              if (attribute !== 'connectedTo') {
                console.log(attribute);
                tabContent.push(<p>{attribute}: {String(block.outports[k][attribute])}</p>);
              }
              else if (attribute === 'connectedTo') {
                console.log(attribute);
                tabContent.push(<p>connectedTo:</p>);
                if (block.outports[k].connectedTo.length === 0) {
                  console.log("LENGTH OF ARRAY IS ZERO");
                  tabContent.push(<p>[]</p>);
                }
                else if (block.outports[k].connectedTo !== null) {
                  for (var l = 0; l < block.outports[k].connectedTo.length; l++) {
                    tabContent.push(<p>[block: {block.outports[k].connectedTo[l]['block']},</p>);
                    tabContent.push(<p>port: {block.outports[k].connectedTo[l]['port']}]</p>)
                  }
                }
                else if (block.outports[k].connectedTo === null) {
                  tabContent.push(<p>null</p>);
                }
              }
            }
            //tabContent.push(<p>, </p>);
          }
        }
        console.log(tabContent);
        return tabContent;
      };

      return (
        <Tab title={tabLabel}>

          <Content>
            <b>Attributes of {tabLabel}</b> <br/>
            {betterTabContent()}
          </Content>

        </Tab>
      )
    });

    /* Using allBlockTabInfo instead of going through the intermediate tabState array */
    //var calculateTabsInfo = function() {
    //  var i = 0;
    //  var tabs = [];
    //  console.log(this.props.allBlockTabInfo);
    //  console.log(this.props.allBlockTabOpenStates);
    //  for (var block in this.props.allBlockTabInfo) {
    //    console.log(block);
    //    i = i + 1;
    //    console.log(this.props.allBlockTabOpenStates[block]);
    //    console.log(block.label);
    //    if (this.props.allBlockTabOpenStates[block] === true) {
    //      console.log("a tab is open, time to calculate its contents");
    //      var tabContent = [];
    //
    //      tabContent.push(<p>x: {this.props.allBlockTabInfo[block].position.x}</p>);
    //      tabContent.push(<p>y: {this.props.allBlockTabInfo[block].position.y}</p>);
    //      tabContent.push(<br/>);
    //
    //      tabContent.push(<p>Inports</p>);
    //      for (var j = 0; j < this.props.allBlockTabInfo[block].inports.length; j++) {
    //        for (var attribute in this.props.allBlockTabInfo[block].inports[j]) {
    //          if (attribute !== 'connectedTo') {
    //            console.log(block);
    //            console.log(this.props.allBlockTabInfo[block].inports[j][attribute]);
    //            tabContent.push(<p>{attribute}: {String(this.props.allBlockTabInfo[block].inports[j][attribute])}</p>);
    //          }
    //          else if (attribute === 'connectedTo') {
    //            tabContent.push(<p>connectedTo:</p>);
    //            if (this.props.allBlockTabInfo[block].inports[j].connectedTo !== null) {
    //              //for (var subAttribute in block.inports[j].connectedTo) {
    //              tabContent.push(<p>block: {this.props.allBlockTabInfo[block].inports[j].connectedTo.block}</p>);
    //              tabContent.push(<p>port: {this.props.allBlockTabInfo[block].inports[j].connectedTo.port}</p>);
    //              //}
    //            }
    //            else if (this.props.allBlockTabInfo[block].inports[j].connectedTo === null) {
    //              tabContent.push(<p>null</p>);
    //            }
    //          }
    //        }
    //        //tabContent.push(<p>, </p>);
    //      }
    //      tabContent.push(<br/>);
    //
    //      console.log(tabContent);
    //
    //      tabContent.push(<p>Outports</p>);
    //      for (var k = 0; k < this.props.allBlockTabInfo[block].outports.length; k++) {
    //        /* connectedTo for an outport is an array, so have to iterate through an array rather than using a for in loop */
    //        for (var attribute in this.props.allBlockTabInfo[block].outports[k]) {
    //          if (attribute !== 'connectedTo') {
    //            console.log(attribute);
    //            tabContent.push(<p>{attribute}: {String(this.props.allBlockTabInfo[block].outports[k][attribute])}</p>);
    //          }
    //          else if (attribute === 'connectedTo') {
    //            console.log(attribute);
    //            tabContent.push(<p>connectedTo:</p>);
    //            if (this.props.allBlockTabInfo[block].outports[k].connectedTo.length === 0) {
    //              console.log("LENGTH OF ARRAY IS ZERO");
    //              tabContent.push(<p>[]</p>);
    //            }
    //            else if (this.props.allBlockTabInfo[block].outports[k].connectedTo !== null) {
    //              for (var l = 0; l < this.props.allBlockTabInfo[block].outports[k].connectedTo.length; l++) {
    //                tabContent.push(<p>[block: {this.props.allBlockTabInfo[block].outports[k].connectedTo[l]['block']},</p>);
    //                tabContent.push(<p>port: {this.props.allBlockTabInfo[block].outports[k].connectedTo[l]['port']}]</p>)
    //              }
    //            }
    //            else if (this.props.allBlockTabInfo[block].outports[k].connectedTo === null) {
    //              tabContent.push(<p>null</p>);
    //            }
    //          }
    //        }
    //        //tabContent.push(<p>, </p>);
    //      }
    //      tabs.push(
    //        <Tab title={this.props.allBlockTabInfo[block].label}>
    //
    //          <Content>Attributes of {this.props.allBlockTabInfo[block].label} <br/> Tab number {i}
    //            {tabContent}
    //          </Content>
    //
    //        </Tab>
    //      )
    //    }
    //    else if (this.props.allBlockTabOpenStates[block] === false) {
    //      console.log("that block tab wasn't open, so don't open the " + block.label + " tab");
    //    }
    //  }
    //  console.log(tabs);
    //
    //  return(
    //    tabs
    //  )
    //}.bind(this);

    return (
        <Panel ref="panel" theme="flexbox" skin={skin} useAvailableHeight={true} globals={globals} buttons={[


            <Button title="Remove active tab" onButtonClick={this.handleActionRemoveBlockTab}>
              <i className="fa fa-times"></i>
            </Button>,
            <Button title="Drop down menu">
            <div id="dropDown"><Dropdown changeTab={this.handleActionTabChangeViaOtherMeans}
            tabState={this.props.tabState}
            listVisible={this.props.listVisible}
            /></div>
            </Button>
          ]}>
          {betterTabs}
        </Panel>
    );
  }
});

module.exports = SidePane;

//
//dropdownChange:function(tab) {
//  this.refs.panel.setSelectedIndex(tab, null);
//  console.log(tab)
//  console.log("it ran correctly");
//},
//<Panel ref="panel" theme="flexbox" skin={skin} useAvailableHeight={true} globals={globals} buttons={[
//
//      //<Button title="Add another tab" onButtonClick={this.handleActionAddTab}>
//      //  <i className="fa fa-plus"></i>
//      //</Button>,
//      <Button title="Remove active tab" onButtonClick={this.handleActionRemoveNodeTab}>
//        <i className="fa fa-times"></i>
//      </Button>,
//      <Button title="Drop down menu">
//      <div id="dropDown"><Dropdown changeTab={this.handleActionTabChangeViaOtherMeans} /></div>
//      </Button>
//    ]}>
//  {tabs}
//</Panel>
//handleActionPassingSidePaneOnMount: function(){
//  console.log(this);
//  //sidePaneActions.passingSidePane(this)
//},
//<Button title="Add another tab" onButtonClick={this.handleActionAddTab}>
//  <i className="fa fa-plus"></i>
//</Button>,

/* This was for the tabs when I had coloured blocks instead of nodes */

//var tabs = this.state.tabState.map(function(item, i) {
//  var tabTitle = "Tab " + item.name;
//  var tabIndex = i + 1;
//  var tabContent = function(){
//    var content = [];
//    for (var outerkey in item.info){                      /*can't use .map since item.info is an object, not an array*/
//      content.push(<br/>);
//      content.push(<p>{outerkey}</p>);
//      for (var key in item.info[outerkey])
//        content.push(<p>{key}: {item.info[outerkey][key]}</p>)
//    }
//    return content
//  };
//  return (
//    <Tab key={item.name} title={tabTitle}>
//
//      <Content>Content of {tabTitle} <br/> Tab number {tabIndex}
//        {tabContent()}
//      </Content>
//
//    </Tab>
//  );
//}.bind(this));
