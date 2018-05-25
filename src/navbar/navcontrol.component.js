import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { KeyboardArrowDown } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  currentLink: {
    cursor: 'pointer',
  },
};

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

    return (
      <div className={classes.container}>
        <IconButton
          onClick={this.handleClick}
          disabled={nav.children.length === 0}
        >
          <KeyboardArrowDown />
        </IconButton>
        <Typography
          className={classes.currentLink}
          onClick={() => navigateToChild(nav.path)}
        >
          {nav.path}
        </Typography>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {nav.children.map(child => (
            <MenuItem
              key={child}
              onClick={() => {
                this.handleClose();
                navigateToChild(child);
              }}
            >
              {child}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

NavControl.propTypes = {
  nav: PropTypes.shape({
    path: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  navigateToChild: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(NavControl);
