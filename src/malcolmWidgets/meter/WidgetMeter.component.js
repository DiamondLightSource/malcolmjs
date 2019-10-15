import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  div: {
    maxHeight: '28px',
    minHeight: '28px',
    borderLeft: `2px solid ${theme.palette.divider}`,
  },
});

const WidgetMeter = props => {
  const prog = Math.min(props.value / props.limits.limitHigh * 100, 100);
  const startCol = props.theme.palette.background.paper;
  const endCol =
    props.value > props.limits.limitHigh
      ? props.theme.palette.Error
      : props.theme.palette.primary.main;
  return (
    <div className={props.classes.div}>
      <div
        style={{
          position: 'relative',
          left: '0px',
          backgroundImage: `linear-gradient(to right, ${startCol}, ${endCol})`,
          maxHeight: '28px',
          minHeight: '28px',
          minWidth: '100%',
        }}
      />
      <div
        style={{
          backgroundColor: props.theme.palette.background.paper,
          position: 'relative',
          maxHeight: '28px',
          minHeight: '28px',
          left: `${prog}%`,
          top: '-28px',
          minWidth: `${100 - prog}%`,
          maxWidth: `${100 - prog}%`,
          borderLeft: `2px solid ${props.theme.palette.divider}`,
          borderRight: `2px solid ${props.theme.palette.divider}`,
        }}
      />
    </div>
  );
};

WidgetMeter.propTypes = {
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        main: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
      Error: PropTypes.string,
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
      divider: PropTypes.string,
    }),
  }).isRequired,
  value: PropTypes.number.isRequired,
  limits: PropTypes.shape({
    limitHigh: PropTypes.number,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(WidgetMeter);
