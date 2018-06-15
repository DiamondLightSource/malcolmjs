import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BugReport } from '@material-ui/icons';
import { connect } from 'react-redux';
import WidgetLED from '../../led/widgetLED.component';
import WidgetCheckbox from '../../checkbox/checkbox.component';
import WidgetComboBox from '../../comboBox/comboBox.component';
import WidgetTextInput from '../../textInput/WidgetTextInput.component';
import TextUpdate from '../../textUpdate/WidgetTextUpdate.component';
import {
  malcolmPutAction,
  malcolmSetPending,
} from '../../../malcolm/malcolmActionCreators';
import ButtonAction from '../../buttonAction/buttonAction.component';

const styles = () => ({
  missingAttribute: {
    color: 'red',
  },
});

const AttributeSelector = props => {
  if (props.attribute && props.attribute.meta && props.attribute.meta.tags) {
    const { tags } = props.attribute.meta;
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);

    const setDisabled =
      props.attribute.pending || !props.attribute.meta.writeable;

    const isErrorState = props.attribute.errorState;

    if (widgetTagIndex !== -1) {
      if (tags[widgetTagIndex] === 'widget:led') {
        return (
          <WidgetLED
            LEDState={props.attribute.value}
            colorBorder={props.theme.palette.primary.light}
            colorCenter={props.theme.palette.primary.light}
          />
        );
      } else if (tags[widgetTagIndex] === 'widget:checkbox') {
        return (
          <WidgetCheckbox
            CheckState={props.attribute.value}
            Pending={setDisabled}
            checkEventHandler={isChecked =>
              props.eventHandler(props.attribute.path, isChecked)
            }
          />
        );
      } else if (tags[widgetTagIndex] === 'widget:combo') {
        return (
          <WidgetComboBox
            Value={props.attribute.value}
            Pending={setDisabled}
            Choices={props.attribute.meta.choices}
            selectEventHandler={event =>
              props.eventHandler(props.attribute.path, event.target.value)
            }
          />
        );
      } else if (tags[widgetTagIndex] === 'widget:textupdate') {
        return <TextUpdate Text={props.attribute.value} />;
      } else if (tags[widgetTagIndex] === 'widget:textinput') {
        return (
          <WidgetTextInput
            Error={isErrorState}
            Value={props.attribute.value.toString()}
            Pending={setDisabled}
            submitEventHandler={event =>
              props.eventHandler(props.attribute.path, event.target.value)
            }
            focusHandler={() => {}}
            blurHandler={() => {}}
          />
        );
      } else if (tags[widgetTagIndex] === 'widget:flowgraph') {
        return <ButtonAction text="View" clickAction={() => {}} />;
      }
    }
  }
  return <BugReport className={props.classes.missingAttribute} />;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  eventHandler: (path, value) => {
    dispatch(malcolmSetPending(path, true));
    dispatch(malcolmPutAction(path, value));
  },
});

AttributeSelector.propTypes = {
  attribute: PropTypes.shape({
    meta: PropTypes.shape({
      tags: PropTypes.arrayOf(PropTypes.string),
      choices: PropTypes.arrayOf(PropTypes.string),
      writeable: PropTypes.bool,
    }),
    path: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    pending: PropTypes.bool,
    errorState: PropTypes.bool,
    alarm: PropTypes.shape({
      severity: PropTypes.number,
    }),
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
  classes: PropTypes.shape({
    missingAttribute: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(AttributeSelector)
);
