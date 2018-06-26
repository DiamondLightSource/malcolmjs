import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BugReport } from '@material-ui/icons';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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

export const selectorFunction = (
  widgetTag,
  value,
  setDisabled,
  isErrorState,
  eventHandler,
  buttonClickHandler,
  path,
  style,
  objectMeta
) => {
  if (widgetTag === 'widget:led') {
    return (
      <WidgetLED
        LEDState={value}
        colorBorder={style.colorLED}
        colorCenter={style.colorLED}
      />
    );
  } else if (widgetTag === 'widget:checkbox') {
    return (
      <WidgetCheckbox
        CheckState={value}
        Pending={setDisabled}
        checkEventHandler={isChecked => eventHandler(path, isChecked)}
      />
    );
  } else if (widgetTag === 'widget:combo') {
    return (
      <WidgetComboBox
        Value={value}
        Pending={setDisabled}
        Choices={objectMeta.choices}
        selectEventHandler={event => eventHandler(path, event.target.value)}
      />
    );
  } else if (widgetTag === 'widget:textupdate') {
    return <TextUpdate Text={value} />;
  } else if (widgetTag === 'widget:textinput') {
    return (
      <WidgetTextInput
        Error={isErrorState}
        Value={value.toString()}
        Pending={setDisabled}
        submitEventHandler={event => eventHandler(path, event.target.value)}
        focusHandler={() => {}}
        blurHandler={() => {}}
      />
    );
  } else if (widgetTag === 'widget:flowgraph') {
    return <ButtonAction text="View" clickAction={() => {}} />;
  } else if (widgetTag === 'widget:table') {
    return (
      <ButtonAction text="View" clickAction={() => buttonClickHandler(path)} />
    );
  }
  return <BugReport className={style.missingAttribute} />;
};

const AttributeSelector = props => {
  if (props.attribute && props.attribute.meta && props.attribute.meta.tags) {
    const { tags } = props.attribute.meta;
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);

    const setDisabled =
      props.attribute.pending || !props.attribute.meta.writeable;

    const isErrorState = props.attribute.errorState;

    if (widgetTagIndex !== -1) {
      return selectorFunction(
        tags[widgetTagIndex],
        props.attribute.value,
        setDisabled,
        isErrorState,
        props.eventHandler,
        props.buttonClickHandler,
        props.attribute.path,
        {
          colorLED: props.theme.palette.primary.light,
          missingAttribute: props.classes.missingAttribute,
        },
        props.attribute.meta
      );
    }
  }
  return null;
};

const mapStateToProps = () => ({});

/**
 * mapDispatchToProps:
 * This is a clean mechanism to allow a component event
 * to dispatch notifications to the appropriate action creators.
 * @param dispatch
 * @returns {{eventHandler: eventHandler, buttonClickHandler: (function(*): *)}}
 */
const mapDispatchToProps = dispatch =>
  // const n = path => dispatch(push(`/gui/${path}/table`));
  ({
    eventHandler: (path, value) => {
      dispatch(malcolmSetPending(path, true));
      dispatch(malcolmPutAction(path, value));
    },
    // buttonClickHandler: n,
    buttonClickHandler: path => dispatch(push(`/gui/${path[0]}/table`)),
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
  buttonClickHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(AttributeSelector)
);
