import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { darken } from 'material-ui/styles/colorManipulator';
import { connect } from 'react-redux';
import WidgetLED from '../../led/widgetLED.component';
import WidgetCheckbox from '../../checkbox/checkbox.component';
import TextUpdate from '../../textUpdate/WidgetTextUpdate.component';
import {
  malcolmPutAction,
  malcolmSetPending,
} from '../../../malcolm/malcolmActionCreators';

const styles = theme => ({
  spinner: {
    size: 44,
    color: darken(theme.palette.primary.light, 0.25),
  },
});

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

    if (tags.some(t => t === 'widget:checkbox')) {
      return (
        <WidgetCheckbox
          CheckState={props.attribute.value}
          Pending={props.attribute.pending}
          checkEventHandler={isChecked =>
            props.checkHandler(props.attribute.path, isChecked)
          }
        />
      );
    }
  }
  return <div>Hello</div>;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  checkHandler: (path, isChecked) => {
    dispatch(malcolmSetPending(path));
    dispatch(malcolmPutAction(path, isChecked));
  },
});

AttributeSelector.propTypes = {
  attribute: PropTypes.shape({
    meta: PropTypes.shape({
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    path: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    pending: PropTypes.bool,
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
  checkHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(AttributeSelector)
);
