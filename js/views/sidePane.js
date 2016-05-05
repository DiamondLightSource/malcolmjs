/**
 * Created by twi18192 on 01/09/15.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var ReactPanels = require('react-panels');
var Dropdown = require('./dropdownMenu');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');
var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var SidePaneTabContents = require('./sidePaneTabContents');

var SidePane = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    /* Even though all the props of sidePane will need to cause a
    rerender if changed, if I don't put shouldComponentUpdate with
    all of them in, sidePane will rerender whenever sidebar does,
    which isn't quite what I want
     */
    return (
      nextProps.selectedTabIndex !== this.props.selectedTabIndex ||
      nextProps.listVisible !== this.props.listVisible ||
      nextProps.tabState !== this.props.tabState
    )
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

  //handleActionInitialFetchOfBlockData: function(){
  //  paneActions.initialFetchOfBlockDataFromBlockStore("fetch the initial block data!");
  //},
  handleActionRemoveBlockTab: function(){
    var selectedIndex = this.refs.panel.getSelectedIndex();
    paneActions.removeBlockTab(selectedIndex);
  },

  componentDidMount: function(){
    this.handleActionPassSidePane();
    ReactDOM.findDOMNode(this).addEventListener('keydown', this.disableTabKey);
  },

  componentWillUnmount: function(){
    ReactDOM.findDOMNode(this).removeEventListener('keydown', this.disableTabKey);
  },

  disableTabKey: function(e){
    console.log(e);
    if(e.keyCode === 9){
      console.log("tab key!");
      e.preventDefault();
    }
  },

  render: function () {

    console.log("render: sidePane");

    var skin = this.props.skin || "default",
      globals = this.props.globals || {};

    var tabs = this.props.tabState.map(function(block){
      return (
        <Tab key={block.label + "tab"} title={block.label}>
          <SidePaneTabContents tabObject={block} />
        </Tab>
      )
    }.bind(this));

    return (
        <Panel ref="panel" theme="flexbox"
               skin={skin} useAvailableHeight={true}
               globals={globals}
               buttons={[

            <Button title="Remove active tab" onButtonClick={this.handleActionRemoveBlockTab}>
              <i className="fa fa-times"></i>
            </Button>,
            <Button title="Drop down menu">
              <div id="dropDown">
                <Dropdown changeTab={this.handleActionTabChangeViaOtherMeans}
                          tabState={this.props.tabState}
                          listVisible={this.props.listVisible}
                />
              </div>
            </Button>
          ]}
        >
          {tabs}
        </Panel>
    );
  }
});

module.exports = SidePane;
