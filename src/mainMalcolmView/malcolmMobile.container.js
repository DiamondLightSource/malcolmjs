import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BlockDetails from '../blockDetails/blockDetails.component';
import MiddlePanelContainer from './middlePanel.container';
// eslint-disable-next-line import/no-named-as-default
import InfoDetails from '../infoDetails/infoDetails.component';
import NavTypes from '../malcolm/NavTypes';
import { flagAsPopout } from '../viewState/viewState.actions';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    minHeight: '100vh',
    paddingTop: 1,
  },
  toolbar: {
    minWidth: 320,
    display: 'flex',
    padding: '0 8px',
  },
  title: {
    flexGrow: 1,
  },
});

const MalcolmPopOut = props => {
  let display;
  switch (props.displayElement.navType) {
    case NavTypes.Block:
      display = <BlockDetails mri={props.displayElement.blockMri} />;
      break;
    case NavTypes.Info:
      display = <InfoDetails />;
      break;
    case NavTypes.Attribute:
      display = (
        <div style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
          <MiddlePanelContainer mobile />
        </div>
      );
      break;
    default:
      display = <Typography>Error parsing address!</Typography>;
  }

  return (
    <div className={props.classes.container}>
      <Drawer
        anchor="top"
        open={props.openHeader}
        PaperProps={{ style: { height: '64px' } }}
        variant="persistent"
      >
        <AppBar position="static">
          <Toolbar className={props.classes.toolbar}>
            <Typography
              variant="title"
              color="inherit"
              className={props.classes.title}
            >
              {props.displayElement.label}
            </Typography>
          </Toolbar>
        </AppBar>
      </Drawer>

      {display}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const displayIndex =
    ownProps.displayIndex !== undefined
      ? ownProps.displayIndex
      : state.malcolm.navigation.navigationLists.length - 1;
  const displayElement =
    state.malcolm.navigation.navigationLists.length > 0
      ? state.malcolm.navigation.navigationLists[displayIndex]
      : {};

  return {
    displayElement,
    openHeader: state.viewState.openHeaderBar,
  };
};

const mapDispatchToProps = dispatch => ({
  setIsPopout: () => {
    dispatch(flagAsPopout());
  },
});

MalcolmPopOut.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  displayElement: PropTypes.shape({
    navType: PropTypes.string,
    label: PropTypes.string,
    blockMri: PropTypes.string,
  }).isRequired,
  openHeader: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(MalcolmPopOut)
);
