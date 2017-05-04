/**
 * Created by twi18192 on 25/01/16.
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import MainPane from './mainPane';
import SidePane from './sidePane';
import ModalDialogBox from './modalDialogBox';

import mainPaneStore from '../stores/mainPaneStore';
import sidePaneStore from '../stores/sidePaneStore';
import paneStore from '../stores/paneStore';
import flowChartStore from '../stores/flowChartStore';

import paneActions from '../actions/paneActions';

import SideBar from 'react-sidebar';

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
  //display: 'flex',
  "height": "100%",
  "width" : "100%"
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

    /* SidePane's getter functions for stores */
    tabState        : paneStore.getTabState(),
    selectedTabIndex: paneStore.getSelectedTabIndex(),
    listVisible     : sidePaneStore.getDropdownState(),

    /* Need to switch SidePane content depending on whether any block are selected
     * If they are not then display a list of available blocks for the user
     * to drag to the FlowChart pane.
     * */
    areAnyBlocksSelected: flowChartStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected : flowChartStore.getIfAnyEdgesAreSelected()

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
    this.state = getBothPanesState();
    this.__onChange = this.__onChange.bind(this);
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
    componentWillUnmount(){
    mainPaneStore.removeChangeListener(this.__onChange);
    paneStore.removeChangeListener(this.__onChange);
    sidePaneStore.removeChangeListener(this.__onChange);

    this.state.mql.removeListener(this.windowWidthMediaQueryChanged);
    }

    windowWidthMediaQueryChanged()
      {
      paneActions.windowWidthMediaQueryChanged(this.state.mql.matches);
      }

    render()
      {

      //console.log("render: sidebar (BothPanes)");
      /* abc <DragDropContextProvider backend={HTML5Backend}> */
      /*  DragDropContextProvider established to encompass both panes (MainPane and SidePane) */
      /*  This is to facilitate dragging a block from the list in the SidePane and dropping it */
      /*  into the FlowChart (via MainPane)*/

      /* Note: It is not good practice to pass children as props (see SideBar below),
       * they should be passed as content between the element start and end tags.
       * TODO: Determine whether this is a design issue of react-sidebar or MalcolmJS.
       * IJG May 2017 */
      //console.log("BothPanes.render() ----------------------------");
      return (
          <div id="BothPanesContainer" style={BothPanesContainerStyle}>
            <ModalDialogBox modalDialogBoxOpen={this.state.modalDialogBoxOpen}
                            modalDialogBoxInfo={this.state.modalDialogBoxInfo}
            />
            <SideBar sidebarClassName="sidebar"
                     styles={SidebarStyling}
                     docked={this.state.sidebarOpen}
                     pullRight={true} touchHandleWidth={5}
                     children={
                       <MainPane footers={this.state.footers}/>
                     }

                     sidebar={
                       <SidePane tabState={this.state.tabState}
                                 selectedTabIndex={this.state.selectedTabIndex}
                                 listVisible={this.state.listVisible}
                                 areAnyBlocksSelected={this.state.areAnyBlocksSelected}
                                 areAnyEdgesSelected={this.state.areAnyEdgesSelected}
                       />}
            />
            {/* -- Commented out properties for this MainPane JSX element -- */}
            {/* favTabOpen={this.state.favTabOpen} */}
            {/* configTabOpen={this.state.configTabOpen} */}
            {/* loadingInitialData={this.state.loadingInitialData} */}
            {/* loadingInitialDataError={this.state.loadingInitialDataError} */}
          </div>
      )
      }
  }

BothPanes.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
};

