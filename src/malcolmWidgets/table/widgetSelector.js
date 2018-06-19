import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BugReport } from '@material-ui/icons';
import WidgetLED from '../led/widgetLED.component';
import WidgetCheckbox from '../checkbox/checkbox.component';
import WidgetComboBox from '../comboBox/comboBox.component';
import WidgetTextInput from '../textInput/WidgetTextInput.component';
import TextUpdate from '../textUpdate/WidgetTextUpdate.component';
import ButtonAction from '../buttonAction/buttonAction.component';

const styles = () => ({
  missingAttribute: {
    color: 'red',
  },
});

export const getWidgetTags = attribute =>
  attribute.labels.map(label => {
    const { tags } = attribute.meta.elements[label];
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    if (widgetTagIndex !== -1) {
      return tags[widgetTagIndex];
    }
    return -1;
  });

const WidgetSelector = props => {
  const setDisabled = false;
  const isErrorState = false;
  if (props.columnWidget === 'widget:led') {
    return (
      <WidgetLED
        LEDState={props.value}
        colorBorder={props.theme.palette.primary.light}
        colorCenter={props.theme.palette.primary.light}
      />
    );
  } else if (props.columnWidget === 'widget:checkbox') {
    return (
      <WidgetCheckbox
        CheckState={props.value}
        Pending={setDisabled}
        checkEventHandler={isChecked => props.rowChangeHandler(isChecked)}
      />
    );
  } else if (props.columnWidget === 'widget:combo') {
    return (
      <WidgetComboBox
        Value={props.value}
        Pending={setDisabled}
        Choices={[]}
        selectEventHandler={event => props.rowChangeHandler(event.target.value)}
      />
    );
  } else if (props.columnWidget === 'widget:textupdate') {
    return <TextUpdate Text={props.value} />;
  } else if (props.columnWidget === 'widget:textinput') {
    return (
      <WidgetTextInput
        Error={isErrorState}
        Value={props.value.toString()}
        Pending={setDisabled}
        submitEventHandler={event => props.rowChangeHandler(event.target.value)}
        focusHandler={() => {}}
        blurHandler={() => {}}
      />
    );
  } else if (props.columnWidget === 'widget:flowgraph') {
    return <ButtonAction text="View" clickAction={() => {}} />;
  } else if (props.columnWidget === 'widget:table') {
    return <ButtonAction text="View" clickAction={() => {}} />;
  }
  return <BugReport className={props.classes.missingAttribute} />;
};

WidgetSelector.propTypes = {
  value: PropTypes.oneOf(PropTypes.string, PropTypes.number).isRequired,
  columnWidget: PropTypes.string.isRequired,
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
  rowChangeHandler: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(WidgetSelector);
