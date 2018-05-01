import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

/*
const styles = theme => ({
  border: {
    fill: theme.palette.primary.light,
  },
  center: {
    fill: theme.palette.primary.dark,
  },
  svg: {
    width: 50,
  },
});
*/

const styles = (colorBorder, colorCenter) => ({
  border: {
    fill: colorBorder,
  },
  center: {
    fill: colorCenter,
  },
  svg: {
    width: 50,
  },
});

const outlinePath =
  'm36.25 8.6648c-7.1431-5.7237-17.356-5.7237-24.499 3e-7l-3.1781-3.1781-3.0856 3.0856 3.1781 3.1781c-5.7237 7.1431-5.7237 17.356 0 24.499l-3.1781 3.1781 3.0856 3.0856 3.1781-3.1781c7.1431 5.7237 17.356 5.7237 24.499 1e-6l3.1781 3.1781 3.0856-3.0856-3.1781-3.1781c5.7237-7.1431 5.7237-17.356 0-24.499l3.1781-3.1781-3.0856-3.0856-3.1781 3.1781zm-1.4502 26.135c-5.9628 5.9628-15.636 5.9628-21.599 0-5.9628-5.9628-5.9628-15.636 0-21.599 5.9628-5.9628 15.636-5.9628 21.599 0 5.9628 5.9628 5.9628 15.636 0 21.599zm8.706-12.981c-1.0036-9.0982-8.2255-16.32-17.324-17.324v-4.4945h-4.3636v4.4945c-9.0982 1.0036-16.32 8.2255-17.324 17.324h-4.4945v4.3636h4.4945c1.0036 9.0982 8.2255 16.32 17.324 17.324v4.4945h4.3636v-4.4945c9.0982-1.0036 16.32-8.2255 17.324-17.324h4.4945v-4.3636h-4.4945zm-19.505 17.455c-8.4327 0-15.273-6.84-15.273-15.273s6.84-15.273 15.273-15.273 15.273 6.84 15.273 15.273-6.84 15.273-15.273 15.273z';

const WidgetLED = props => {
  const configuredStyles = styles(props.colorBorder, props.colorCenter);
  return (
    <div style={{ backgroundColor: 'rgb(66,66,66)' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={configuredStyles.svg.width}
        viewBox="-24 -24 96 96"
      >
        <path d={outlinePath} fill={configuredStyles.border.fill} />;
        {props.LEDState ? (
          <circle cx="24" cy="24" r="12" fill={configuredStyles.center.fill} />
        ) : null}
      </svg>
    </div>
  );
};

WidgetLED.propTypes = {
  LEDState: PropTypes.bool.isRequired,
  colorBorder: PropTypes.string.isRequired,
  colorCenter: PropTypes.string.isRequired,
};
export default withStyles(styles, { withTheme: true })(WidgetLED);
