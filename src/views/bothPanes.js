/**
 * Created by twi18192 on 25/01/16.
 */
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FlowChartControllerView from './flowChartControllerView';
import SidePane from './sidePane';
import ModalDialogBox from './modalDialogBox';
import paneStore from '../stores/paneStore';
import flowChartStore from '../stores/flowChartStore';
import paneActions from '../actions/paneActions';
import flowChartActions  from '../actions/flowChartActions';
import breadBin from '../stores/breadbin';
import MjsBreadcrumbs from '../components/mjsBreadcrumbs';
import WasteBin from './wasteBin';
import {Toolbar, IconButton, AppBar, Hidden, Drawer,
  withStyles, Button, Icon} from 'material-ui';


function getBothPanesState() {
  return {
    /* Its own getter functions first */
    sidebarOpen: paneStore.getSidebarOpenState(),
    modalDialogBoxOpen: paneStore.getModalDialogBoxOpenState(),
    modalDialogBoxInfo: paneStore.getModalDialogBoxInfo(),

    /* DlsSidePane's getter functions for stores */
    tabState: paneStore.getTabState(),
    selectedTabIndex: paneStore.getSelectedTabIndex(),

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

const styles = theme => ({
  fullHeight: {
    position: "absolute",
    height: "100vh",
  },
  drawer: {
    width: theme.size.drawer,
    overflowX: "hidden"
  },
  appBar: {
    position: "absolute"
  },
  flex: {
    flex: 1,
  },
  hideDesktop: {
    [theme.breakpoints.up('sm')]: {
      display: "none",
    },
  },
  backgroundToolbar: {
    // Put background on so jerky transitions are less
    backgroundColor: theme.palette.primary[500],
    position: "fixed",
    width: "100%",
    ...theme.mixins.toolbar,
  },
  fab: {
    position: "fixed",
    bottom: theme.size.fab,
    right: theme.size.fab,
    width: theme.size.fab,
    height: theme.size.fab,
    marginBottom: document.getElementById('root').getAttribute("data-nav-height")
  },
});

class BothPanes extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = getBothPanesState();
    /**
     * Navigation drawer state
     */
    this.state.leftOpen = true;

    this.__onChange = this.__onChange.bind(this);
    this.__onBreadcrumbChange = this.__onBreadcrumbChange.bind(this);
    this.toggleLeft = this.toggleLeft.bind(this);
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
    paneStore.addChangeListener(this.__onChange);
    flowChartStore.addChangeListener(this.__onChange);
    breadBin.addChangeListener(this.__onBreadcrumbChange);
  }

  componentWillUnmount()
  {
    paneStore.removeChangeListener(this.__onChange);
  }

  toggleLeft = () => {
    this.setState({
      leftOpen: !this.state.leftOpen
    });
  };

  toggleRight = () => {
    paneActions.toggleSidebar();
    flowChartActions.deselectAllBlocks();
    flowChartActions.deselectAllEdges();
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

    const {classes, theme} = this.props;

    const leftDrawer = (
      <SidePane
        tabObject={{label: ""}}
        onClose={this.toggleLeft}
        areAnyBlocksSelected={true}
        areAnyEdgesSelected={false}
      />
    );

    const appBar = (
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters>
          <IconButton
            onClick={this.toggleLeft}
            className={classNames(this.state.leftOpen && classes.hideDesktop)}
            color="secondary"
          >
              <Icon>menu</Icon>
          </IconButton>
          <MjsBreadcrumbs/>
          {/*<IconButton>open_in_new</IconButton>*/}
        </Toolbar>
      </AppBar>
    );

    const rightDrawer = (
      <SidePane
        tabObject={this.state.tabState[this.state.selectedTabIndex]}
        onClose={this.toggleRight}
        areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected}
      />
    );

    // Calculate how big the main window should be on a desktop with sidebars
    let desktopDivStyle = {position: "absolute", height: "100vh"};

    let sub = 0;
    if (this.state.leftOpen) {
      desktopDivStyle.marginLeft = theme.size.drawer;
      sub += theme.size.drawer;
    }
    if (this.state.sidebarOpen) {
      desktopDivStyle.marginRight = theme.size.drawer;
      sub += theme.size.drawer;
    }
    if (this.state.leftOpen || this.state.sidebarOpen) {
      desktopDivStyle.transition = theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      });
      desktopDivStyle.width = `calc(100% - ${sub}px)`;
    } else {
      desktopDivStyle.transition = theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      });
      desktopDivStyle.width = "100%";
    }    

    let fab;
    if (flowChartStore.getHeldBlock() === null) {
      fab = (
        <Button
          variant="fab"
          className={classes.fab}
          onClick={this.toggleRight}
        >
          <Icon>add</Icon>
        </Button>
      );
    } else {
      fab = (
        <WasteBin/>
      )
    }

    return (
      <div>
        <div className={classes.backgroundToolbar}/>
        <Hidden xsDown>
          <div>
            <Drawer
              variant="persistent"
              anchor="left"
              open={this.state.leftOpen}
            >
              {leftDrawer}
            </Drawer>
            <div style={desktopDivStyle}>
              {appBar}
            </div>
            <Drawer
              variant="persistent"
              anchor="right"
              open={this.state.sidebarOpen}
            >
              {rightDrawer}
            </Drawer>
          </div>
        </Hidden>
        <Hidden smUp>
          <div>
            <Drawer
              variant="temporary"
              anchor="left"
              open={this.state.leftOpen}
              onRequestClose={this.toggleLeft}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {leftDrawer}
            </Drawer>
            <div>
              {appBar}
            </div>
            <Drawer
              variant="temporary"
              anchor="right"
              open={this.state.sidebarOpen}
              onRequestClose={this.toggleRight}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {rightDrawer}
            </Drawer>
          </div>
        </Hidden>
        <FlowChartControllerView/>
        {fab}
        <ModalDialogBox
          modalDialogBoxInfo={this.state.modalDialogBoxInfo}
          modalDialogBoxOpen={this.state.modalDialogBoxOpen}
        />
      </div>
    );
  }
}

BothPanes.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
};

export default withStyles(styles, {withTheme: true})(BothPanes);