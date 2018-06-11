import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Layout from '../layout/layout.component';
import { malcolmSelectBlock } from '../malcolm/malcolmActionCreators';

const styles = () => ({
  container: {
    marginTop: 64,
    height: '100%',
    width: '100%',
  },
  layoutArea: {
    display: 'flex',
    width: '100%',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'rgb(48, 48, 48)',
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px',
  },
});

const findAttributeComponent = props => {
  if (props.mainAttribute === 'layout') {
    return (
      <div className={props.classes.layoutArea}>
        <Layout />
      </div>
    );
  }

  return null;
};

const resetSelection = dispatch => {
  dispatch(malcolmSelectBlock(''));
};

const MiddlePanelContainer = props => (
  <div
    className={props.classes.container}
    onClick={() => props.resetSelection()}
    role="presentation"
  >
    {findAttributeComponent(props)}
  </div>
);

const mapStateToProps = state => ({
  mainAttribute: state.malcolm.mainAttribute,
});

const mapDispatchToProps = dispatch => ({
  resetSelection: () => resetSelection(dispatch),
});

findAttributeComponent.propTypes = {
  mainAttribute: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    layoutArea: PropTypes.string,
  }).isRequired,
};

MiddlePanelContainer.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
  resetSelection: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MiddlePanelContainer)
);
