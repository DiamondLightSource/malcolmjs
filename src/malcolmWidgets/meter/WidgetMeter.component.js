import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const ReactFitText = require('react-fittext');

const styles = theme => ({
  div: {
    maxHeight: '100%',
    minHeight: '100%',
    borderLeft: `2px solid ${theme.palette.divider}`,
    display: 'grid',
    gridTemplateColumns: '100%',
    gridTemplateRows: '100%',
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
          gridColumn: '1',
          gridRow: '1',
          left: '0px',
          backgroundImage: `linear-gradient(to right, ${startCol}, ${endCol})`,
          minWidth: '100%',
        }}
      />
      <div
        style={{
          position: 'relative',
          gridColumn: '1',
          gridRow: '1',
          backgroundColor: props.theme.palette.background.paper,
          left: `calc(${prog}% - 2px)`,
          minWidth: `${100 - prog}%`,
          maxWidth: `${100 - prog}%`,
          borderLeft: `2px solid ${endCol}`,
        }}
      />
      <div
        style={{
          gridColumn: '1',
          gridRow: '1',
          position: 'relative',
        }}
      >
        <ReactFitText>
          <Typography>
            {`${props.value} / ${props.limits.limitHigh}`}
          </Typography>
        </ReactFitText>
      </div>
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
