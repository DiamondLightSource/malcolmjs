/**
 * Created by twi18192 on 25/01/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var MainPane = require('./mainPane');
var SidePane = require('./sidePane');

var mainPaneStore = require('../stores/mainPaneStore');
var mainPaneActions = require('../actions/mainPaneActions');
var sidePaneStore = require('../stores/sidePaneStore');
var sidePaneActions = require('../actions/sidePaneActions');
var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

var SideBar = require('react-sidebar').default;

var MainTabbedViewStyle = {
  "height": "100%",
  "width": "100%",
  minWidth: 200,
  minHeight: 500,
  display: 'inlineBlock'
};

var SideTabbedViewStyle = {
  float: 'right',
  "height": "100%",
  "width": "100%",
  maxWidth:400
};

var SidebarStyling = {
  root: {
    position: 'absolute',
    id: "root",
    //minWidth: 900, /* For the 500 minWidth of mainpane, and then the 400 that the sidepane will always be*/
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    id: "sidebar",
    width: "400px",
    position: 'absolute',
    top: 0,
    //left: "400px",
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    position: 'absolute',
    id: "content",
    //minWidth: 500,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    id: "overlay",
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    id: "draghandle",
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};

function getBothPanesState(){
  return{
    /* Its own getter functions first */
    sidebarOpen: paneStore.getSidebarOpenState(),

    /* MainPane's getter functions for stores */
    footers: mainPaneStore.getFooterState(),
    //favPanelOpen: mainPaneStore.getFavPanelState(),
    favTabOpen: paneStore.getFavTabOpen(),
    //configPanelOpen: mainPaneStore.getConfigPanelState(),
    configTabOpen: paneStore.getConfigTabOpen(),

    /* SidePane's getter functions for stores */
    tabState: paneStore.getTabState(),
    selectedTabIndex: paneStore.getSelectedTabIndex(),
    listVisible: sidePaneStore.getDropdownState()

  }
}

var BothPanes = React.createClass({
  getInitialState: function(){
    return getBothPanesState();
  },

  _onChange: function(){
    this.setState(getBothPanesState());
  },

  componentDidMount: function(){
    console.log(this.state);
    mainPaneStore.addChangeListener(this._onChange);
    paneStore.addChangeListener(this._onChange);
    sidePaneStore.addChangeListener(this._onChange);
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.windowWidthMediaQueryChanged);
    this.setState({mql: mql}, function(){
      paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
    });
  },
  componentWillUnmount(){
    mainPaneStore.removeChangeListener(this._onChange);
    paneStore.removeChangeListener(this._onChange);
    sidePaneStore.removeChangeListener(this._onChange);
    this.state.mql.removeListener(this.windowWidthMediaQueryChanged);
  },

  windowWidthMediaQueryChanged: function(){
    paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
  },

  render: function(){

    console.log(this.state);

    return(
      <SideBar sidebarClassName="sidebar" styles={SidebarStyling} docked={this.state.sidebarOpen}
               //open={this.state.sidebarOpen}
               pullRight={true} touchHandleWidth={5}
               children={
               //<div id="MainTabbedView" style={MainTabbedViewStyle}>
                <MainPane footers={this.state.footers}
                favTabOpen={this.state.favTabOpen}
                configTabOpen={this.state.configTabOpen}
                //theGraphDiamondState={this.state.theGraphDiamondState}
                />
                //</div>
                }
               sidebar={
               //<div id="SideTabbedView" style={SideTabbedViewStyle}>
               <SidePane tabState={this.state.tabState} selectedTabIndex={this.state.selectedTabIndex} listVisible={this.state.listVisible}
               />
               //</div>
               }>
      </SideBar>
    )
  }
});

module.exports = BothPanes;
