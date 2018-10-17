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
    const siblings = nav.parent ? nav.parent.children : [];
    const siblingLabels = nav.parent ? nav.parent.childrenLabels : [];
    if (this.props.isFinalNav) {
      return (
        <div className={classes.container}>
          <NavSelector
            handleClick={this.handleClick}
            childElements={nav.children}
            childElementLabels={nav.childrenLabels}
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
            (siblingLabels && siblingLabels.includes(nav.label)) ||
            [NavTypes.Info, NavTypes.Palette].includes(nav.navType)
              ? 'default'
              : 'error'
          }
          variant="subheading"
          onClick={() => navigateToChild(nav.path)}
        >
          {nav.label}
        </Typography>
        <NavSelector
          handleClick={this.handleClick}
          childElements={siblings}
          childElementLabels={siblingLabels}
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
      disabled={props.childElements.length === 0}
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
      {props.childElements.map((child, i) => (
        <MenuItem
          key={child}
          onClick={() => {
            props.handleClose();
            props.navigateToChild(child);
          }}
        >
          {props.childElementLabels[i]}
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
};

NavControl.defaultProps = {
  isFinalNav: false,
};

NavSelector.propTypes = {
  childElements: PropTypes.arrayOf(PropTypes.string).isRequired,
  childElementLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
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

export default withStyles(styles, { withTheme: true })(NavControl);
