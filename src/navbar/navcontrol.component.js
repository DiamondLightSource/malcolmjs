import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavTypes from '../malcolm/NavTypes';

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  currentLink: {
    cursor: 'pointer',
  },
});

class NavControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes, nav, navigateToChild } = this.props;
    const { anchorEl } = this.state;
    const siblings = nav.parent ? nav.parent.children : {};
    if (this.props.isFinalNav) {
      return (
        <div className={classes.container} style={this.props.divOverride}>
          <NavSelector
            handleClick={this.handleClick}
            childElements={nav.children}
            anchorEl={anchorEl}
            handleClose={this.handleClose}
            navigateToChild={navigateToChild}
            icon={<MoreHoriz />}
            theme={this.props.theme}
          />
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <Typography
          className={classes.currentLink}
          color={
            (siblings && Object.keys(siblings).includes(nav.path)) ||
            [NavTypes.Info, NavTypes.Palette].includes(nav.navType)
              ? 'inherit'
              : 'error'
          }
          variant="subheading"
          onClick={() => navigateToChild(nav.path)}
        >
          {nav.path}
        </Typography>
        <NavSelector
          currentPath={nav.path}
          handleClick={this.handleClick}
          childElements={siblings}
          anchorEl={anchorEl}
          handleClose={this.handleClose}
          navigateToChild={navigateToChild}
          icon={<KeyboardArrowDown />}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

export const NavSelector = props => (
  <div style={{ paddingRight: '12px' }}>
    <IconButton
      onClick={props.handleClick}
      disabled={Object.keys(props.childElements).length === 0}
      data-cy="navmenu"
      style={{ height: '32px', width: '32px', padding: 0 }}
    >
      {props.icon}
    </IconButton>
    <Menu
      id="simple-menu"
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.handleClose}
      style={{ color: props.theme.palette.text.primary }}
    >
      {Object.keys(props.childElements).map(child => (
        <MenuItem
          selected={child === props.currentPath}
          key={child}
          onClick={() => {
            props.handleClose();
            props.navigateToChild(child);
          }}
        >
          <Typography align="left" style={{ paddingRight: '4px' }}>
            {props.childElements[child].label === child ? child : `${child} - `}
          </Typography>
          {props.childElements[child].label === child ? null : (
            <Typography variant="caption" align="right">
              {props.childElements[child].label}
            </Typography>
          )}
        </MenuItem>
      ))}
    </Menu>
  </div>
);

NavControl.propTypes = {
  nav: PropTypes.shape({
    path: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  navigateToChild: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    currentLink: PropTypes.string,
  }).isRequired,
  isFinalNav: PropTypes.bool,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      text: PropTypes.shape({
        primary: PropTypes.string,
      }),
    }),
  }).isRequired,
  divOverride: PropTypes.shape({}),
};

NavControl.defaultProps = {
  isFinalNav: false,
  divOverride: undefined,
};

NavSelector.propTypes = {
  currentPath: PropTypes.string,
  childElements: PropTypes.shape({}).isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.string.isRequired,
  // navigateToChild: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      text: PropTypes.shape({
        primary: PropTypes.string,
      }),
    }),
  }).isRequired,
};

NavSelector.defaultProps = {
  currentPath: undefined,
};

export default withStyles(styles, { withTheme: true })(NavControl);
