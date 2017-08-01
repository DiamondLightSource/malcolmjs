/**
 * Created by twi18192 on 25/01/16.
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import MainPane from './mainPane';
import DlsSidePane from './sidePane';
import ModalDialogBox from './modalDialogBox';

import mainPaneStore from '../stores/mainPaneStore';
import sidePaneStore from '../stores/sidePaneStore';
import paneStore from '../stores/paneStore';
import flowChartStore from '../stores/flowChartStore';

import paneActions from '../actions/paneActions';

import AppBar from 'react-toolbox/lib/app_bar/AppBar';
import Layout from 'react-toolbox/lib/layout/Layout';
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer';
import Panel from 'react-toolbox/lib/layout/Panel';
import Sidebar from 'react-toolbox/lib/layout/Sidebar';
import theme from '../styles/AppBar.css';
import FontIcon from 'react-toolbox/lib/font_icon';
import styles from "../styles/mjsTheme.css";
import ThemeProvider from 'react-css-themr/lib/components/ThemeProvider';

console.log('bothPanes: styles', styles);
console.log('bothPanes: theme', theme);
//import {DragDropContextProvider} from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';
//import ItemTypes from './dndItemTypes';

// Needed for onTouchTap
// todo: ????
//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

let MainTabbedViewStyle = {
  "height" : "100%",
  "width"  : "100%",
  minWidth : 200,
  minHeight: 500,
  display  : 'inlineBlock'
};

let SideTabbedViewStyle = {
  float   : 'right',
  "height": "100%",
  "width" : "100%",
  maxWidth: 400
};

let BothPanesContainerStyle = {
  margin  : 0,
  padding : 0,
  display: 'flex',
  overflowY: 'autos',
  flexDirection: 'row',
  height: "100%",
  width : "100%"
};

let SidebarStyling = {
  root      : {
    position : 'absolute',
    id       : "root",
    //minWidth: 900, /* For the 500 minWidth of mainpane, and then the 400 that the sidepane will always be*/
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
    //overflow: 'hidden',
    overflowX: 'hidden',
    /* Allow overflowY to be normal, so then a scrollbar will
     appear when the content of a tab overflows
     */
  },
  sidebar   : {
    zIndex          : 2,
    id              : "sidebar",
    width           : "400px",
    position        : 'absolute',
    top             : 0,
    //left: "400px",
    bottom          : 0,
    transition      : 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange      : 'transform',
    overflowY       : 'auto',
  },
  content   : {
    position  : 'absolute',
    id        : "content",
    //minWidth: 500,
    top       : 0,
    left      : 0,
    right     : 0,
    bottom    : 0,
    overflow  : 'auto',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay   : {
    zIndex         : 1,
    id             : "overlay",
    position       : 'fixed',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    opacity        : 0,
    visibility     : 'hidden',
    transition     : 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex  : 1,
    id      : "draghandle",
    position: 'fixed',
    top     : 0,
    bottom  : 0,
  },
};

// Stub out window.matchMedia() if running under Jest test simulation
// as the mocked function does not appear to be supported.
window.matchMedia = window.matchMedia || function ()
    {
    return {
      matches       : false,
      addListener   : function ()
        {
        },
      removeListener: function ()
        {
        }
    };
    };

function getBothPanesState()
  {
  return {
    /* Its own getter functions first */
    sidebarOpen       : paneStore.getSidebarOpenState(),
    modalDialogBoxOpen: paneStore.getModalDialogBoxOpenState(),
    modalDialogBoxInfo: paneStore.getModalDialogBoxInfo(),

    /* MainPane's getter functions for stores */
    footers: mainPaneStore.getFooterState(),
    //favTabOpen: paneStore.getFavTabOpen(),
    //configTabOpen: paneStore.getConfigTabOpen(),
    //loadingInitialData: paneStore.getIfLoadingInitialData(),
    //loadingInitialDataError: paneStore.getIfLoadingInitialDataError(),

    /* DlsSidePane's getter functions for stores */
    tabState        : paneStore.getTabState(),
    selectedTabIndex: paneStore.getSelectedTabIndex(),
    listVisible     : sidePaneStore.getDropdownState(),

    /* Need to switch DlsSidePane content depending on whether any block are selected
     * If they are not then display a list of available blocks for the user
     * to drag to the FlowChart pane.
     * */
    areAnyBlocksSelected: flowChartStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected : flowChartStore.getIfAnyEdgesAreSelected(),



  }
  }

const boxTarget = {
  drop() {
  return {name: 'flowChart'};
  },
};


export default class BothPanes extends React.Component {
constructor(props)
  {
  super(props);
  this.state      = getBothPanesState();
  /**
   * Navigation drawer state
   */
  this.state.drawerActive = false;
  this.state.drawerPinned = false;
  this.state.sidebarPinned = false;

  this.__onChange = this.__onChange.bind(this);
    this.toggleDrawerActive = this.toggleDrawerActive.bind(this);
  }

__onChange()
  {
  this.setState(getBothPanesState());
  }

componentDidMount()
  {
  let mql = window.matchMedia(`(min-width: 800px)`);
  mainPaneStore.addChangeListener(this.__onChange);
  paneStore.addChangeListener(this.__onChange);
  sidePaneStore.addChangeListener(this.__onChange);
  flowChartStore.addChangeListener(this.__onChange);

  mql.addListener(this.windowWidthMediaQueryChanged);
  this.setState({mql: mql}, function ()
  {
  paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
  });
  }

componentWillUnmount()
  {
  mainPaneStore.removeChangeListener(this.__onChange);
  paneStore.removeChangeListener(this.__onChange);
  sidePaneStore.removeChangeListener(this.__onChange);

  this.state.mql.removeListener(this.windowWidthMediaQueryChanged);
  }

windowWidthMediaQueryChanged()
  {
  paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
  }

  toggleDrawerActive = () => {
  this.setState({ drawerActive: !this.state.drawerActive });
  };

  toggleDrawerPinned = () => {
  this.setState({ drawerPinned: !this.state.drawerPinned });
  };

  toggleSidebar = () => {
  this.setState({ sidebarPinned: !this.state.sidebarPinned });
  };


render()
  {

  /* abc <DragDropContextProvider backend={HTML5Backend}> */
  /*  DragDropContextProvider established to encompass both panes (MainPane and DlsSidePane) */
  /*  This is to facilitate dragging a block from the list in the DlsSidePane and dropping it */
  /*  into the FlowChart (via MainPane)*/

  /* Note: It is not good practice to pass children as props (see SideBar below),
   * they should be passed as content between the element start and end tags.
   * TODO: Determine whether this is a design issue of react-sidebar or MalcolmJS.
   * IJG May 2017
   * */

  const actions = [
    { label: 'Alarm', raised: true, icon: 'access_alarm'},
    { label: 'Location', raised: true, accent: true, icon: 'room'}
  ];

const bp3 =
  <ThemeProvider theme={theme}>
    {/*<Layout  id="BothPanesContainer" style={BothPanesContainerStyle}>*/}
  <Layout  id="BothPanesContainer" className={styles.layout}>
  <NavDrawer active={this.state.drawerActive}
             pinned={this.state.drawerPinned}
             onOverlayClick={ this.toggleDrawerActive }>
    <p>
      PandA context etc. goes here.
    </p>
  </NavDrawer>
  <Panel style={{scrollY:"false", height:"100vh", width: "75%"}}>
    <div id='MainPaneDivWrapper' style={{ flex: 1, overflowY: 'hidden', height:'inherit'}}>
      <AppBar leftIcon='menu' theme={theme} onLeftIconClick={ this.toggleDrawerActive }/>
      <MainPane footers={this.state.footers}/>
    </div>
  </Panel>
  <Sidebar id="rightsidepane" pinned={ true } style={{overflowY:'overlap'}}>
    <div><FontIcon value='close' onClick={ this.toggleSidebar }/></div>
    <div id="DlsSidePaneContainerDiv" style={{ flex: 1, flexDirection: 'row' }}>
      <DlsSidePane id="DlsSidePane" tabState={this.state.tabState}
                   selectedTabIndex={this.state.selectedTabIndex}
                   listVisible={this.state.listVisible}
                   areAnyBlocksSelected={this.state.areAnyBlocksSelected}
                   areAnyEdgesSelected={this.state.areAnyEdgesSelected}/>
    </div>
  </Sidebar>
</Layout>
    </ThemeProvider>;


  return ( bp3 );

  }
}

BothPanes.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver           : PropTypes.bool.isRequired,
  canDrop          : PropTypes.bool.isRequired,
};

