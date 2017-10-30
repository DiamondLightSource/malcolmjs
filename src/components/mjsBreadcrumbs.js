/**
 * Created by Ian Gillingham on 21/06/17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import breadBin from '../stores/breadbin';
import {Typography, withStyles, Toolbar} from 'material-ui';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  breadCrumbs: {
    marginLeft: theme.spacing.unit,
    width: "calc(100% - 48px)",
    overflow: "hidden"
  }
});

class MjsBreadcrumbs extends Component {
  componentDidMount()
  {
    breadBin.addChangeListener(this.__onBreadcumbsChange);
  }

  componentWillUnmount()
  {}

  shouldComponentUpdate(nextProps, nextState)
  {
    let bRet = true;
    return (bRet);
  }

  __onBreadcumbsChange()
    {

    }

  render()
  {
    const {classes} = this.props;

    return (
      <Toolbar className={classes.breadCrumbs} disableGutters>
        <Typography type="subheading">{MalcolmActionCreators.deviceId}</Typography>
      </Toolbar>
    );
  }
}

MjsBreadcrumbs.defaultProps = {
  cbClicked: null
};

MjsBreadcrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default withStyles(styles)(MjsBreadcrumbs);