import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import WidgetLED from '../../led/widgetLED.component';
import TextUpdate from '../../textUpdate/WidgetTextUpdate.component';

const styles = {};

const AttributeSelector = props => {
  if (props.attribute && props.attribute.meta && props.attribute.meta.tags) {
    const { tags } = props.attribute.meta;
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);

    if (widgetTagIndex !== -1) {
      if (tags[widgetTagIndex] === 'widget:led') {
        return (
          <WidgetLED
            LEDState={props.attribute.value}
            colorBorder={props.theme.palette.primary.light}
            colorCenter={props.theme.palette.primary.light}
          />
        );
      } else if (tags[widgetTagIndex] === 'widget:textupdate') {
        return <TextUpdate Text={props.attribute.value} />;
      }
    }
  }

  return <div>Hello</div>;
};

AttributeSelector.propTypes = {
  attribute: PropTypes.shape({
    meta: PropTypes.shape({
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(AttributeSelector);
