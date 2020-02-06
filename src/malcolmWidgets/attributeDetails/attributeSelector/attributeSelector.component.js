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
import WidgetMeter from '../../meter/WidgetMeter.component';
import AttributeAlarm from '../attributeAlarm/attributeAlarm.component';
import {
  malcolmPutAction,
  malcolmSetFlag,
  writeLocalState,
} from '../../../malcolm/malcolmActionCreators';
import ButtonAction from '../../buttonAction/buttonAction.component';
import LayoutButtonGraphic from '../../buttonAction/layoutButtonGraphic.component';
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

export const Widget = {
  NONE: 'widget:',
  FLOWGRAPH: 'widget:flowgraph',
  TABLE: 'widget:table',
  PLOT: 'widget:plot',
  TREE: 'widget:tree',
  TEXTUPDATE: 'widget:textupdate',
  MULTILINE: 'widget:multilinetextupdate',
  TEXTINPUT: 'widget:textinput',
  LED: 'widget:led',
  CHECKBOX: 'widget:checkbox',
  COMBO: 'widget:combo',
  METER: 'widget:meter',
  HELP: 'widget:help',
  GROUP: 'widget:group',
  ICON: 'widget:icon',
  FFMPEG: 'widget:ffmpeg',
  i_ALARM: 'info:alarm',
  i_MULTILINE: 'info:multiline',
  i_BUTTON: 'info:button',
};

export const isArrayType = meta =>
  // malcolm array types have IDs "malcolm:core/[Number,String]ArrayMeta:1.x"
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

export const format = (value, displayT) =>
  typeof value === 'number' ? value.toFixed(displayT.precision) : value;
// switch (displayT.form) {
//   case 'Decimal':
//     return value.toFixed(displayT.precision);
//   case 'Exponential':
//     return value.toExponential(displayT.precision);
//   case 'Engineering': {
//     const mantissa =
//       value === 0.0 ? 1 : Math.floor(Math.log10(Math.abs(value)));
//     const exponent =
//       Math.sign(mantissa) * 3.0 * Math.floor(Math.abs(mantissa) / 3);
//     return `${Math.sign(value) >= 0 ? '+' : '-'}${(
//       Math.abs(value) /
//       10 ** exponent
//     ).toFixed(displayT.precision)}E${
//       Math.sign(exponent) >= 0 ? '+' : '-'
//     }${Math.abs(exponent)
//       .toFixed(0)
//       .padStart(2, '0')}`;
//   }
//   default:
//     return value.toString();
// }

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
  localState,
  isMobile = false,
  forceOpen = false
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
    case Widget.LED:
      return (
        <WidgetLED
          LEDState={value}
          colorBorder={colorLED}
          colorCenter={colorLED}
        />
      );
    case Widget.CHECKBOX:
      return (
        <WidgetCheckbox
          CheckState={value}
          Pending={flags.isDisabled}
          checkEventHandler={isChecked => valueHandler(path, isChecked)}
          isUndefined={value === undefined}
        />
      );
    case Widget.COMBO:
      return (
        <WidgetComboBox
          Value={value}
          Pending={flags.isDisabled}
          Choices={objectMeta.choices}
          selectEventHandler={setValue => valueHandler(path, setValue)}
          mobile={isMobile}
          forceOpen={forceOpen}
        />
      );
    case Widget.TEXTUPDATE:
      return (
        <TextUpdate
          Text={objectMeta.display ? format(value, objectMeta.display) : value}
          Units={(objectMeta.display && objectMeta.display.units) || null}
        />
      );
    case Widget.METER:
      return (
        <WidgetMeter
          value={value}
          limits={objectMeta.display}
          Error={flags.isErrorState}
          readOnly={flags.isDisabled}
          submitEventHandler={event => valueHandler(path, event.target.value)}
          localState={localState}
          isDirty={flags.isDirty}
          setFlag={(flag, state) => flagHandler(path, flag, state)}
          isSelected={flags.isSelected}
          isBlockDisplay={flags.isBlockDisplay}
        />
      );
    case Widget.TEXTINPUT: {
      let displayValue = '';
      if (objectMeta.display) {
        displayValue = format(value, objectMeta.display);
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
          Units={(objectMeta.display && objectMeta.display.units) || null}
        />
      );
    }
    case Widget.TABLE:
      return (
        <ButtonAction
          text={objectMeta.writeable ? 'Edit' : 'View'}
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case Widget.FFMPEG:
      return (
        <ButtonAction
          text="View"
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case Widget.PLOT:
      return objectMeta.insideArray ? (
        <TextUpdate
          Text={objectMeta.display ? format(value, objectMeta.display) : value}
          Units={(objectMeta.display && objectMeta.display.units) || null}
        />
      ) : (
        <ButtonAction
          text={objectMeta.writeable ? 'Edit' : 'View'}
          clickAction={() => buttonClickHandler(path)}
        />
      );

    case Widget.FLOWGRAPH:
      return (
        <div style={{ position: 'relative', minHeight: '28px' }}>
          <LayoutButtonGraphic
            style={{
              position: 'absolute',
              top: '2px',
              left: '0px',
              maxWidth: '100%',
              minWidth: '100%',
            }}
          />
          <ButtonAction
            text={objectMeta.writeable ? 'Edit' : 'View'}
            clickAction={() => buttonClickHandler(path)}
            style={{ position: 'absolute', top: '0px' }}
          />
        </div>
      );
    case Widget.TREE:
      return (
        <ButtonAction
          text={objectMeta.writeable ? 'Edit' : 'View'}
          clickAction={() => buttonClickHandler(path)}
        />
      );
    case Widget.MULTILINE:
    case Widget.i_MULTILINE:
      return <TextUpdate Text={`${value}`} noWrap={false} />;
    case Widget.i_BUTTON:
      return (
        <ButtonAction
          method
          text={value}
          clickAction={() => buttonClickHandler()}
          disabled={flags.isDisabled}
        />
      );
    case Widget.HELP:
      return (
        <ButtonAction
          text="View"
          clickAction={() => window.open(value)}
          id={`help.${path[0]}.${path[1]}`}
        />
      );
    case Widget.i_ALARM:
      return (
        <AttributeAlarm
          alarmSeverity={value.alarm}
          fieldType={value.fieldType}
        />
      );
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
      isSelected: props.isMainAttribute,
      isBlockDisplay: props.isBlockDisplay,
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
        },
        props.mobile,
        props.forceOpen
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
    isMainAttribute:
      attribute &&
      attribute.calculated &&
      ownProps.blockName === state.malcolm.parentBlock &&
      state.malcolm.mainAttribute === attribute.calculated.name,
    isGrandchild: ownProps.blockName === state.malcolm.childBlock,
    mobile: state.viewState && state.viewState.mobileViewIndex !== undefined,
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
    raw: PropTypes.shape({
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
  forceOpen: PropTypes.bool,
  eventHandler: PropTypes.func.isRequired,
  buttonClickHandler: PropTypes.func.isRequired,
  buttonClickHandlerWithTransition: PropTypes.func.isRequired,
  isBlockDisplay: PropTypes.bool,
  isMainAttribute: PropTypes.bool,
};

AttributeSelector.defaultProps = {
  forceOpen: false,
  isBlockDisplay: false,
  isMainAttribute: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(AttributeSelector)
);
