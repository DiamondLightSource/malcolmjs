import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import BugReport from '@material-ui/icons/BugReport';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

import WidgetLED from '../../led/widgetLED.component';
import WidgetCheckbox from '../../checkbox/checkbox.component';
import WidgetComboBox from '../../comboBox/comboBox.component';
import WidgetTextInput from '../../textInput/WidgetTextInput.component';
import TextUpdate from '../../textUpdate/WidgetTextUpdate.component';
import AttributeAlarm from '../attributeAlarm/attributeAlarm.component';
import {
  malcolmPutAction,
  malcolmSetFlag,
  writeLocalState,
} from '../../../malcolm/malcolmActionCreators';
import ButtonAction from '../../buttonAction/buttonAction.component';
import navigationActions from '../../../malcolm/actions/navigation.actions';
import blockUtils from '../../../malcolm/blockUtils';
import { parentPanelTransition } from '../../../viewState/viewState.actions';

export const malcolmTypes = {
  bool: 'malcolm:core/BooleanMeta:1.0',
  string: 'malcolm:core/StringMeta:1.0',
  number: 'malcolm:core/NumberMeta:1.0',
  choice: 'malcolm:core/ChoiceMeta:1.0',
  boolArray: 'malcolm:core/BooleanArrayMeta:1.0',
  stringArray: 'malcolm:core/StringArrayMeta:1.0',
  numberArray: 'malcolm:core/NumberArrayMeta:1.0',
  choiceArray: 'malcolm:core/ChoiceArrayMeta:1.0',
  table: 'malcolm:core/TableMeta:1.0',
  pointGenerator: 'malcolm:core/PointGeneratorMeta:1.0',
};

export const isArrayType = meta =>
  meta &&
  meta.typeid &&
  meta.typeid
    .split('/')[1]
    .split(':')[0]
    .slice(-9) === 'ArrayMeta';

export const getDefaultFromType = objectMeta => {
  switch (objectMeta.typeid) {
    case malcolmTypes.bool:
    case malcolmTypes.boolArray:
      return false;
    case malcolmTypes.string:
    case malcolmTypes.stringArray:
      return '';
    case malcolmTypes.number:
    case malcolmTypes.numberArray:
      return 0;
    case malcolmTypes.choice:
    case malcolmTypes.choiceArray:
      return null;
    case malcolmTypes.pointGenerator:
      return {};
    default:
      return undefined;
  }
};

export const format = (value, displayT) => {
  switch (displayT.form) {
    case 'Decimal':
      return value.toFixed(displayT.precision);
    case 'Exponential':
      return value.toExponential(displayT.precision);
    case 'Engineering': {
      const mantissa = Math.floor(Math.log10(value));
      const exponent = Math.sign(mantissa) * Math.floor(Math.abs(mantissa) / 3);
      return `${value.toFixed(displayT.precision / 10 ** exponent)}E${Math.sign(
        exponent
      )}` > 0
        ? '+'
        : `-${Math.abs(exponent).toString()}`;
    }
    default:
      return value.toString();
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
  buttonClickHandler = () => {},
  localState
) => {
  if (isArrayType(objectMeta) && !objectMeta.insideArray) {
    return (
      <ButtonAction
        text={objectMeta.writeable ? 'Edit' : 'View'}
        clickAction={() => buttonClickHandler(path)}
      />
    );
  }
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
      return (
        <TextUpdate
          Text={
            objectMeta.display_t ? format(value, objectMeta.display_t) : value
          }
        />
      );
    case 'widget:title':
    case 'widget:textinput': {
      let displayValue = '';
      if (objectMeta.display_t) {
        displayValue = format(value, objectMeta.display_t);
      } else if (value !== undefined) {
        displayValue = value.toString();
      }
      return (
        <WidgetTextInput
          Error={flags.isErrorState}
          Value={displayValue}
          Pending={flags.isDisabled}
          submitEventHandler={event => valueHandler(path, event.target.value)}
          localState={localState}
          isDirty={flags.isDirty}
          setFlag={(flag, state) => flagHandler(path, flag, state)}
          focusHandler={() => {}}
          blurHandler={() => {}}
          forceUpdate={forceUpdate}
          continuousSend={continuousSend}
        />
      );
    }
    case 'widget:table':
    case 'widget:plot':
      return (
        <ButtonAction
          text={objectMeta.writeable ? 'Edit' : 'View'}
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case 'widget:flowgraph':
    case 'widget:tree':
      return (
        <ButtonAction
          text={objectMeta.writeable ? 'Edit' : 'View'}
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case 'widget:multilinetextupdate':
    case 'info:multiline':
      return <TextUpdate Text={`${value}`} noWrap={false} />;
    case 'info:button':
      return (
        <ButtonAction
          method
          text={value}
          clickAction={() => buttonClickHandler()}
          disabled={flags.isDisabled}
        />
      );
    case 'widget:help':
      return (
        <ButtonAction text="View" clickAction={() => window.open(value)} />
      );
    case 'info:alarm':
      return <AttributeAlarm alarmSeverity={value} />;
    default:
      if (widgetTag.split(':')[0] === 'widget') {
        return (
          <Tooltip title={widgetTag}>
            <BugReport nativeColor="red" />
          </Tooltip>
        );
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
        props.isGrandchild
          ? props.buttonClickHandlerWithTransition
          : props.buttonClickHandler,
        {
          value: props.attribute.localState,
          set: event =>
            props.setLocalState(
              props.attribute.calculated.path,
              event.target.value
            ),
        }
      );
    }
  }
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    ownProps.blockName,
    ownProps.attributeName
  );

  return {
    attribute,
    isGrandchild: ownProps.blockName === state.malcolm.childBlock,
  };
};

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
  },

  buttonClickHandlerWithTransition: path => {
    dispatch(parentPanelTransition(true));
    setTimeout(() => {
      dispatch(navigationActions.navigateToAttribute(path[0], path[1]));
      dispatch(parentPanelTransition(false));
    }, 550);
  },
  setLocalState: (path, value) => {
    dispatch(writeLocalState(path, value));
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
  buttonClickHandlerWithTransition: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(AttributeSelector)
);
