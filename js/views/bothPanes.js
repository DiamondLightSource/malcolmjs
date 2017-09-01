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

import {AppBar} from 'react-toolbox/lib/app_bar';
import {Layout,NavDrawer,Sidebar,Panel} from 'react-toolbox/lib/layout';
import {List,ListItem} from 'react-toolbox/lib/list'
//import NavDrawer from 'react-toolbox/lib/layout/NavDrawer';
import {Drawer} from 'react-toolbox/lib/drawer';
//import Panel from 'react-toolbox/lib/layout/Panel';
//import Sidebar from 'react-toolbox/lib/layout/Sidebar';
import FontIcon from 'react-toolbox/lib/font_icon';
import {Navigation} from 'react-toolbox/lib/navigation';
//import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import {Breadcrumbs} from 'react-breadcrumbs';
import MjsOptions from '../components/MjsOptions';
import MjsBottomBar from '../components/MjsBottomBar.jsx';
//import {Route} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';

import breadBin from '../stores/breadbin';
import MjsBreadcrumbs from '../components/mjsBreadcrumbs';

import styles from "../styles/mjsLayout.scss";

// import ThemeProvider from 'react-css-themr/lib/components/ThemeProvider';

//console.log('bothPanes: styles', styles);
//import {DragDropContextProvider} from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';
//import ItemTypes from './dndItemTypes';

// Needed for onTouchTap
// todo: ????
//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

// Stub out window.matchMedia() if running under Jest test simulation
// as the mocked function does not appear to be supported.
window.matchMedia = window.matchMedia || function() {
  return {matches: false, addListener: function() {}, removeListener: function() {}};
};

function getBothPanesState() {
  return {
    /* Its own getter functions first */
    sidebarOpen: paneStore.getSidebarOpenState(),
    modalDialogBoxOpen: paneStore.getModalDialogBoxOpenState(),
    modalDialogBoxInfo: paneStore.getModalDialogBoxInfo(),

    /* MainPane's getter functions for stores */
    footers: mainPaneStore.getFooterState(),

    /* DlsSidePane's getter functions for stores */
    tabState: paneStore.getTabState(),
    selectedTabIndex: paneStore.getSelectedTabIndex(),
    listVisible: sidePaneStore.getDropdownState(),

    /* Need to switch DlsSidePane content depending on whether any block are selected
     * If they are not then display a list of available blocks for the user
     * to drag to the FlowChart pane.
     * */
    areAnyBlocksSelected: flowChartStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected: flowChartStore.getIfAnyEdgesAreSelected(),
    backgroundSelected: flowChartStore.getBackgroundSelected(),
    selectedBlock: flowChartStore.getSelectedBlock(),

    breadcrumbList: breadBin.breadcrumbs
  }
}

const boxTarget = {
  drop() {
    return {name: 'flowChart'};
  }
};

export default class BothPanes extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = getBothPanesState();
    /**
   * Navigation drawer state
   */
    this.state.drawerActive = false;
    this.state.drawerPinned = false;
    this.state.sidebarPinned = true;

    this.state.breadcrumbList = breadBin.breadcrumbs;

    this.__onChange = this.__onChange.bind(this);
    this.__onBreadcrumbChange = this.__onBreadcrumbChange.bind(this);

    this.toggleDrawerActive = this.toggleDrawerActive.bind(this);
  }

  __onChange()
  {
    this.setState(getBothPanesState());
  }

  __onBreadcrumbChange()
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
    breadBin.addChangeListener(this.__onBreadcrumbChange);

    mql.addListener(this.windowWidthMediaQueryChanged);
    this.setState({
      mql: mql
    }, function() {
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
    this.setState({
      drawerActive: !this.state.drawerActive
    });
  };

  toggleDrawerPinned = () => {
    this.setState({
      drawerPinned: !this.state.drawerPinned
    });
  };

  toggleSidebar = () => {
    this.setState({sidebarPinned: !this.state.sidebarPinned});
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
      {
        label: 'Alarm',
        raised: true,
        icon: 'access_alarm'
      }, {
        label: 'Location',
        raised: true,
        accent: true,
        icon: 'room'
      }
    ];

  let sidebareActive = (this.state.areAnyBlocksSelected || this.state.areAnyEdgesSelected || this.state.backgroundSelected);

    const base_url = 'index.html';

    // Temporary test constructs for router--------
    const Home = () => (
      <div>
        <h2>Home</h2>
      </div>
    );

    const About = () => (
      <div>
        <h2>About</h2>
      </div>
    );
    //-------------------------------------
 /*   this.state.breadcrumbList.map(bc =>
    {
    return (
      <List className={styles.ListParams} nodeLabel={bc}>
        <ListItem>{groupsObject[blockAttribs]} </ListItem>
      </List>
    );
  });
*/

/**
 * Styles from mjsLayout
 *
 */
    const bp3 = <Layout id="BothPanesContainer">
      <Drawer theme={styles} active={this.state.drawerActive} pinned={this.state.drawerPinned} onOverlayClick={this.toggleDrawerActive} >
        <AppBar theme={styles} title='Panda 1' leftIcon='close' rightIcon='open_in_new' onLeftIconClick={this.toggleDrawerActive}/>
        <div>
          <p>
          {"Options"}
          </p>
          <MjsOptions/>
        </div>
      </Drawer>
      <Panel theme={styles}>
        {/*<div id={styles.MainPaneDivWrapper}>*/}
          <AppBar leftIcon='menu' rightIcon='open_in_new' onLeftIconClick={this.toggleDrawerActive}>
            {/* This is probably a good place to handle breadcrumbs */}
            <MjsBreadcrumbs/>
            {/*
            <div>

              <NavLink to={base_url+"/"}>Layout</NavLink>
              <NavLink to={base_url+"/home"}>Home</NavLink>
              <NavLink to={base_url+"/about"}>About</NavLink>
                <div>
                <Route exact path={base_url+"/"} component={Home}/>
                <Route path={base_url+"/layout"} component={About}/>
                <Route path={base_url+"/about"} component={About}/>
              </div>
            </div>
            */}
          </AppBar>
          <MainPane footers={this.state.footers}/>
        {/*</div>*/}
      </Panel>
      {/*<Sidebar id="rightsidepane" pinned={ true } style={{overflowY:'overlap'}}>*/}
      <Sidebar theme={styles} id={styles.rightsidepane}  pinned={sidebareActive} right={true} scrollY={true}>
        <AppBar theme={styles}title={this.state.selectedBlock} onLeftIconClick={ this.toggleSidebar } leftIcon='close' rightIcon='open_in_new'/>
        {/* <div id="DlsSidePaneContainerDiv" style={{flex: 1, flexDirection: 'row'}}> */}
        <DlsSidePane id="DlsSidePane" tabState={this.state.tabState} selectedTabIndex={this.state.selectedTabIndex} listVisible={this.state.listVisible} areAnyBlocksSelected={this.state.areAnyBlocksSelected} areAnyEdgesSelected={this.state.areAnyEdgesSelected}/>
      </Sidebar>
      <MjsBottomBar/>
    </Layout>;

    return (bp3);

  }
}

BothPanes.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
};
