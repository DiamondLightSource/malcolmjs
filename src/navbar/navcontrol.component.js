import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { KeyboardArrowDown } from '@material-ui/icons';
import Menu, { MenuItem } from 'material-ui/Menu';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
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
    const { classes, nav } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={classes.container}>
        <IconButton
          onClick={this.handleClick}
          disabled={nav.children.length === 0}
        >
          <KeyboardArrowDown />
        </IconButton>
        <Typography>{nav.path}</Typography>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {nav.children.map(child => (
            <MenuItem key={child} onClick={this.handleClose}>
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
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(NavControl);
