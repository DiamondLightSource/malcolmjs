import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BlockDetails from '../blockDetails/blockDetails.component';
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
  if (!props.statePopoutFlag) {
    props.setIsPopout();
  }
  return (
    <div className={props.classes.container}>
      <AppBar position="static">
        <Toolbar className={props.classes.toolbar}>
          <Typography
            variant="title"
            color="inherit"
            className={props.classes.title}
          >
            {props.paneTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      {props.isInfo ? <InfoDetails /> : <BlockDetails parent />}
    </div>
  );
};

const mapStateToProps = state => {
  const statePopoutFlag = state.viewState.popout;
  const parentBlock = state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined;

  const parentBlockName = parentBlock ? parentBlock.name : '';

  const { mainAttribute } = state.malcolm;

  const { navigationLists } = state.malcolm.navigation;
  const matchingNavItem = navigationLists.find(
    nav => nav.path === state.malcolm.childBlock
  );
  const navType = matchingNavItem ? matchingNavItem.navType : undefined;
  const isInfo = navType === NavTypes.Info;

  const paneTitle = isInfo
    ? `${parentBlockName}.${mainAttribute}`
    : parentBlockName;

  return {
    parentBlock,
    isInfo,
    paneTitle,
    statePopoutFlag,
  };
};

const mapDispatchToProps = dispatch => ({
  setIsPopout: () => {
    dispatch(flagAsPopout());
  },
});

MalcolmPopOut.propTypes = {
  paneTitle: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  isInfo: PropTypes.bool.isRequired,
  setIsPopout: PropTypes.func.isRequired,
  statePopoutFlag: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(MalcolmPopOut)
);
