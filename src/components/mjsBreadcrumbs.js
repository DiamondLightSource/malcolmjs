/**
 * Created by Ian Gillingham on 21/06/17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import breadBin from '../stores/breadbin';
import {IconButton, Typography, withStyles, Toolbar} from 'material-ui';

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
  constructor(props)
  {
    super(props);
  }

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
        <a href='#'>
          <Typography type="subheading">BL14I-ML-SCAN-01</Typography>
        </a>
        <IconButton id="breadcrumbs0">expand_more</IconButton>
        <a href='#'>
          <Typography type="subheading">Layout</Typography>
        </a>
        <IconButton id="breadcrumbs1">expand_more</IconButton>
        <a href='#'>
          <Typography type="subheading">PANDA</Typography>
        </a>
        <IconButton id="breadcrumbs2">expand_more</IconButton>
        <a href='#'>
          <Typography type="subheading">Layout</Typography>
        </a>
        <IconButton id="breadcrumbs3">expand_more</IconButton>
        <a href='#'>
          <Typography type="subheading" className={classes.flex}>TTLOUT32</Typography>
        </a>
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