import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import BlockDetails from '../blockDetails/blockDetails.component';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    height: '100vh',
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

const MalcolmPopOut = props => (
  <div className={props.classes.container}>
    <AppBar position="static">
      <Toolbar className={props.classes.toolbar}>
        <Typography
          variant="title"
          color="inherit"
          className={props.classes.title}
        >
          {props.parentBlockTitle}
        </Typography>
      </Toolbar>
    </AppBar>
    <BlockDetails block={props.parentBlock} />
  </div>
);

const mapStateToProps = state => {
  const parentBlock = state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined;
  return {
    parentBlock,
    parentBlockTitle: parentBlock ? parentBlock.name : '',
  };
};

const mapDispatchToProps = () => ({});

MalcolmPopOut.propTypes = {
  parentBlock: PropTypes.shape({}),
  parentBlockTitle: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

MalcolmPopOut.defaultProps = {
  parentBlock: undefined,
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(MalcolmPopOut)
);
