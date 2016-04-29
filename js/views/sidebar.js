/**
 * Created by twi18192 on 25/01/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var MainPane = require('./mainPane');
var SidePane = require('./sidePane');
var ModalDialogBox = require('./modalDialogBox');

var mainPaneStore = require('../stores/mainPaneStore');
var sidePaneStore = require('../stores/sidePaneStore');
var paneStore = require('../stores/paneStore');
var blockStore = require('../stores/blockStore.js');
var attributeStore = require('../stores/attributeStore');

var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');

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

var BothPanesContainerStyle = {
  margin: 0,
  padding: 0,
  //display: 'flex',
  "height": "100%",
  "width": "100%"
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
    //overflow: 'hidden',
    overflowX: 'hidden',
    /* Allow overflowY to be normal, so then a scrollbar will
    appear when the content of a tab overflows
     */
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
    sidebarOpen: JSON.parse(JSON.stringify(paneStore.getSidebarOpenState())),
    modalDialogBoxOpen: JSON.parse(JSON.stringify(paneStore.getModalDialogBoxOpenState())),
    modalDialogBoxInfo: JSON.parse(JSON.stringify(paneStore.getModalDialogBoxInfo())),

    /* MainPane's getter functions for stores */
    footers: JSON.parse(JSON.stringify(mainPaneStore.getFooterState())),
    favTabOpen: JSON.parse(JSON.stringify(paneStore.getFavTabOpen())),
    configTabOpen: JSON.parse(JSON.stringify(paneStore.getConfigTabOpen())),
    //loadingInitialData: JSON.parse(JSON.stringify(paneStore.getIfLoadingInitialData())),
    //loadingInitialDataError: JSON.parse(JSON.stringify(paneStore.getIfLoadingInitialDataError())),

    /* SidePane's getter functions for stores */
    tabState: JSON.parse(JSON.stringify(paneStore.getTabState())),
    selectedTabIndex: JSON.parse(JSON.stringify(paneStore.getSelectedTabIndex())),
    listVisible: JSON.parse(JSON.stringify(sidePaneStore.getDropdownState())),

    allBlockInfo: JSON.parse(JSON.stringify(blockStore.getAllBlockInfo())),
    favContent: JSON.parse(JSON.stringify(paneStore.getFavContent())),
    configContent: JSON.parse(JSON.stringify(paneStore.getConfigContent())),
    allBlockAttributes: JSON.parse(JSON.stringify(attributeStore.getAllBlockAttributes())),
    allBlockAttributesIconStatus: JSON.parse(JSON.stringify(attributeStore.getAllBlockAttributesIconStatus())),

    //blockPositions: JSON.parse(JSON.stringify(flowChartStore.getBlockPositions()))

    //allBlockTabOpenStates: paneStore.getAllBlockTabOpenStates(),
  }
}

var BothPanes = React.createClass({
  getInitialState: function(){
    return getBothPanesState();
  },

  _onChange: function(){
    this.setState(getBothPanesState());
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextState.sidebarOpen !== this.state.sidebarOpen ||
      nextState.selectedTabIndex !== this.state.selectedTabIndex ||
      nextState.listVisible !== this.state.listVisible ||
      nextState.tabState !== this.state.tabState ||
      nextState.footers !== this.state.footers ||
      nextState.favTabOpen !== this.state.favTabOpen ||
      nextState.configTabOpen !== this.state.configTabOpen ||

      nextState.allBlockInfo !== this.state.allBlockInfo ||
      nextState.favContent !== this.state.favContent ||
      nextState.configContent !== this.state.configContent ||
      nextState.allBlockAttributes !== this.state.allBlockAttributes ||
      nextState.allBlockAttributesIconStatus !== this.state.allBlockAttributesIconStatus ||
      nextState.modalDialogBoxOpen !== this.state.modalDialogBoxOpen ||
      nextState.modalDialogBoxInfo !== this.state.modalDialogBoxInfo
      //nextState.loadingInitialData !== this.state.loadingInitialData ||
      //nextState.loadingInitialDataError !== this.state.loadingInitialDataError
      //nextState.blockPositions !== this.state.blockPositions
    )
  },

  componentDidMount: function(){
    mainPaneStore.addChangeListener(this._onChange);
    paneStore.addChangeListener(this._onChange);
    sidePaneStore.addChangeListener(this._onChange);
    blockStore.addChangeListener(this._onChange);
    attributeStore.addChangeListener(this._onChange);
    //flowChartStore.addChangeListener(this._onChange);
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
    blockStore.removeChangeListener(this._onChange);
    attributeStore.removeChangeListener(this._onChange);
    //flowChartStore.removeChangeListener(this._onChange);
    this.state.mql.removeListener(this.windowWidthMediaQueryChanged);
  },

  windowWidthMediaQueryChanged: function(){
    paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
  },

  render: function(){

    console.log("render: sidebar");
    //if(this.state.tabState[0]) {
    //  console.log(this.state.tabState[0].position.x);
    //}

    return(
      <div id="BothPanesContainer" style={BothPanesContainerStyle} >
        <ModalDialogBox modalDialogBoxOpen={this.state.modalDialogBoxOpen}
                        modalDialogBoxInfo={this.state.modalDialogBoxInfo}
                        allBlockAttributes={this.state.allBlockAttributes} />
        <SideBar sidebarClassName="sidebar" styles={SidebarStyling} docked={this.state.sidebarOpen}
                 //open={this.state.sidebarOpen}
                 pullRight={true} touchHandleWidth={5}
                 children={
                 //<div id="MainTabbedView" style={MainTabbedViewStyle}>
                  <MainPane footers={this.state.footers}
                  favTabOpen={this.state.favTabOpen}
                  configTabOpen={this.state.configTabOpen}
                  //loadingInitialData={this.state.loadingInitialData}
                  //loadingInitialDataError={this.state.loadingInitialDataError}
                  //theGraphDiamondState={this.state.theGraphDiamondState}
                  />
                  //</div>
                  }
                 sidebar={
                 //<div id="SideTabbedView" style={SideTabbedViewStyle}>
                 <SidePane tabState={this.state.tabState} selectedTabIndex={this.state.selectedTabIndex}
                 listVisible={this.state.listVisible}
                 allBlockInfo={this.state.allBlockInfo}
                 favContent={this.state.favContent}
                 configContent={this.state.configContent}
                 allBlockAttributes={this.state.allBlockAttributes}
                 allBlockAttributesIconStatus={this.state.allBlockAttributesIconStatus}
                 //allBlockTabOpenStates={this.state.allBlockTabOpenStates}
                 //allBlockTabInfo={this.state.allBlockTabInfo}
                 />
                 //</div>
                 }>
        </SideBar>
      </div>
    )
  }
});

module.exports = BothPanes;
