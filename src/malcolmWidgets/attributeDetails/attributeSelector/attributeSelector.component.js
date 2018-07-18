import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { BugReport } from '@material-ui/icons';
import { connect } from 'react-redux';
import WidgetLED from '../../led/widgetLED.component';
import WidgetCheckbox from '../../checkbox/checkbox.component';
import WidgetComboBox from '../../comboBox/comboBox.component';
import WidgetTextInput from '../../textInput/WidgetTextInput.component';
import TextUpdate from '../../textUpdate/WidgetTextUpdate.component';
import {
  malcolmPutAction,
  malcolmSetFlag,
} from '../../../malcolm/malcolmActionCreators';
import ButtonAction from '../../buttonAction/buttonAction.component';
import navigationActions from '../../../malcolm/actions/navigation.actions';

export const getDefaultFromType = objectMeta => {
  switch (objectMeta.typeid) {
    case 'malcolm:core/BooleanMeta:1.0':
      return false;
    case 'malcolm:core/StringMeta:1.0':
      return '';
    case 'malcolm:core/NumberMeta:1.0':
      return 0;
    case 'malcolm:core/BooleanArrayMeta:1.0':
      return false;
    case 'malcolm:core/StringArrayMeta:1.0':
      return '';
    case 'malcolm:core/NumberArrayMeta:1.0':
      return 0;
    default:
      return undefined;
  }
};

export const selectorFunction = (
  widgetTag,
  path,
  value,
  valueHandler,
  flags,
  flagHandler,
  colorLED,
  objectMeta,
  forceUpdate,
  continuousSend = false,
  buttonClickHandler = () => {}
) => {
  switch (widgetTag) {
    case 'widget:led':
      return (
        <WidgetLED
          LEDState={value}
          colorBorder={colorLED}
          colorCenter={colorLED}
        />
      );
    case 'widget:checkbox':
      return (
        <WidgetCheckbox
          CheckState={value}
          Pending={flags.isDisabled}
          checkEventHandler={isChecked => valueHandler(path, isChecked)}
          isUndefined={value === undefined}
        />
      );
    case 'widget:combo':
      return (
        <WidgetComboBox
          Value={value}
          Pending={flags.isDisabled}
          Choices={objectMeta.choices}
          selectEventHandler={event => valueHandler(path, event.target.value)}
        />
      );
    case 'widget:textupdate':
      return <TextUpdate Text={value} />;
    case 'widget:textinput':
      return (
        <WidgetTextInput
          Error={flags.isErrorState}
          Value={value !== undefined ? value.toString() : '-'}
          Pending={flags.isDisabled}
          submitEventHandler={event => valueHandler(path, event.target.value)}
          isDirty={flags.isDirty}
          setFlag={(flag, state) => flagHandler(path, flag, state)}
          focusHandler={() => {}}
          blurHandler={() => {}}
          forceUpdate={forceUpdate}
          continuousSend={continuousSend}
        />
      );
    case 'widget:flowgraph':
      return (
        <ButtonAction
          text="View"
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case 'widget:table':
      return (
        <ButtonAction
          text="View"
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case 'info:multiline':
      return <TextUpdate Text={`${value}`} noWrap={false} />;
    case 'info:button':
      return (
        <ButtonAction
          text={value.buttonLabel}
          clickAction={() => buttonClickHandler()}
          disabled={value.disabled}
        />
      );
    default:
      if (widgetTag.split(':')[0] === 'widget') {
        return <BugReport nativeColor="red" />;
      }
      throw new Error('no widget tag supplied!');
  }
};

const AttributeSelector = props => {
  if (
    props.attribute &&
    props.attribute.raw &&
    props.attribute.raw.meta &&
    props.attribute.raw.meta.tags
  ) {
    const { tags } = props.attribute.raw.meta;
    const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    const flags = {
      isDirty: props.attribute.calculated.dirty,
      isDisabled:
        props.attribute.calculated.pending ||
        !props.attribute.raw.meta.writeable,
      isErrorState: props.attribute.calculated.errorState,
    };
    const continuousSend = false;

    if (widgetTagIndex !== -1) {
      return selectorFunction(
        tags[widgetTagIndex],
        props.attribute.calculated.path,
        props.attribute.raw.value,
        props.eventHandler,
        flags,
        props.setFlag,
        props.theme.palette.primary.light,
        props.attribute.raw.meta,
        props.attribute.calculated.forceUpdate,
        continuousSend,
        props.buttonClickHandler
      );
    }
  }
  return null;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  eventHandler: (path, value) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, value));
  },
  setFlag: (path, flag, state) => {
    dispatch(malcolmSetFlag(path, flag, state));
  },
  buttonClickHandler: path => {
    dispatch(navigationActions.navigateToAttribute(path[0], path[1]));
    // dispatch(push(`/gui/${path[0]}/${path[1]}`));
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
    dirty: PropTypes.bool,
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
  eventHandler: PropTypes.func.isRequired,
  buttonClickHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(AttributeSelector)
);
