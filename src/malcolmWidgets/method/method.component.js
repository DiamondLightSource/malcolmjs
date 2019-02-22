import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AttributeAlarm, {
  AlarmStates,
  FieldTypes,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
import ButtonAction from '../buttonAction/buttonAction.component';

import GroupExpander from '../groupExpander/groupExpander.component';
import blockUtils from '../../malcolm/blockUtils';
import { malcolmPostAction } from '../../malcolm/malcolmActionCreators';
import {
  malcolmUpdateMethodInput,
  malcolmFlagMethodInput,
  malcolmIntialiseMethodParam,
} from '../../malcolm/actions/method.actions';

import {
  selectorFunction,
  getDefaultFromType,
  isArrayType,
} from '../attributeDetails/attributeSelector/attributeSelector.component';
import navigationActions from '../../malcolm/actions/navigation.actions';

const styles = () => ({
  div: {
    display: 'flex',
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: 'center',
  },
  textName: {
    flexGrow: 1,
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  controlContainer: {
    width: 180,
    padding: 2,
  },
  runButton: {
    flexGrow: 1,
    padding: 2,
  },
  missingAttribute: {
    color: 'red',
  },
  button: {
    width: '24px',
    height: '24px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const buildIOComponent = (input, props, isOutput) => {
  const parameterMeta = input[1];
  const widgetTag = parameterMeta.tags.find(t => t.indexOf('widget:') !== -1);
  const flags = {
    isDisabled: props.methodPending || !input[1].writeable,
    isErrorState: props.methodErrored && input[1].writeable,
    isDirty:
      !isOutput &&
      (props.dirtyInputs[input[0]] ||
        props.inputValues[input[0]] !== undefined),
  };
  const updateStoreOnEveryValueChange = true;

  const valueMap = isOutput ? props.outputValues : props.inputValues;
  let inputValue;
  if (valueMap[input[0]] && valueMap[input[0]].value !== undefined) {
    inputValue = valueMap[input[0]].value;
  } else if (props.defaultValues[input[0]] !== undefined) {
    inputValue = props.defaultValues[input[0]];
  } else {
    inputValue = getDefaultFromType(input[1]);
  }
  const submitHandler = (path, value) => {
    props.updateInput(path, input[0], value);
  };
  const setFlag = (path, flagName, flagState) => {
    props.flagInput(path, input[0], flagName, flagState);
  };
  const buttonClickHandler =
    isArrayType(input[1]) && !isOutput
      ? path => {
          props.initialiseLocalState(path, ['takes', input[0]]);
          props.methodParamClickHandler(path);
        }
      : props.methodParamClickHandler;
  const subElement = isOutput ? `returns.${input[0]}` : `takes.${input[0]}`;
  if (widgetTag) {
    return selectorFunction(
      widgetTag,
      [...props.methodPath, subElement],
      inputValue,
      submitHandler,
      flags,
      setFlag,
      props.theme.palette.primary.light,
      parameterMeta,
      false,
      updateStoreOnEveryValueChange,
      buttonClickHandler
    );
  }
  return selectorFunction('widget:undefined');
};

const MethodDetails = props => {
  if (
    (!props.inputs || !Object.keys(props.inputs).length) &&
    (!props.outputs || !Object.keys(props.outputs).length)
  ) {
    return (
      <div className={props.classes.div}>
        <Tooltip title={props.methodMessage}>
          <IconButton
            tabIndex="-1"
            className={props.classes.button}
            disableRipple
            onClick={() =>
              props.infoClickHandler(props.blockName, props.attributeName)
            }
          >
            <AttributeAlarm
              alarmSeverity={props.methodAlarm}
              fieldType={FieldTypes.METHOD}
            />
          </IconButton>
        </Tooltip>
        <div
          className={props.classes.controlContainer}
          style={{ width: '100%' }}
        >
          <ButtonAction
            method
            text={props.methodName}
            disabled={
              !props.writeable || props.methodAlarm === AlarmStates.PENDING
            }
            clickAction={() =>
              props.runMethod(props.methodPath, props.inputValues)
            }
          />
        </div>
      </div>
    );
  }
  return (
    <GroupExpander key={props.methodPath} groupName={props.methodName}>
      <div>
        {Object.entries(props.inputs).map(input => (
          <div key={input[0]} className={props.classes.div}>
            <Tooltip title={props.inputInfo[input[0]]}>
              <IconButton
                tabIndex="-1"
                className={props.classes.button}
                disableRipple
                onClick={() =>
                  props.infoClickHandler(
                    props.blockName,
                    props.attributeName,
                    `takes.${input[0]}`
                  )
                }
              >
                <AttributeAlarm
                  alarmSeverity={props.inputAlarms[input[0]]}
                  fieldType={FieldTypes.PARAMIN}
                />
              </IconButton>
            </Tooltip>
            <Typography className={props.classes.textName}>
              {input[1].label}
            </Typography>
            <div className={props.classes.controlContainer}>
              {buildIOComponent(input, props, false)}
            </div>
          </div>
        ))}
        <div className={props.classes.div}>
          <Tooltip title={props.methodMessage}>
            <IconButton
              tabIndex="-1"
              className={props.classes.button}
              disableRipple
              onClick={() =>
                props.infoClickHandler(props.blockName, props.attributeName)
              }
              style={{ cursor: 'pointer' }}
            >
              <AttributeAlarm
                alarmSeverity={props.methodAlarm}
                fieldType={FieldTypes.METHOD}
              />
            </IconButton>
          </Tooltip>
          <div
            className={props.classes.controlContainer}
            style={{ width: '100%' }}
          >
            <ButtonAction
              method
              text={props.methodName}
              disabled={
                !props.writeable || props.methodAlarm === AlarmStates.PENDING
              }
              clickAction={() =>
                props.runMethod(props.methodPath, props.inputValues)
              }
            />
          </div>
        </div>
        {Object.keys(props.outputValues).length !== 0 ? (
          <div>
            <Typography
              className={props.classes.textName}
              variant="subheading"
              style={{ paddingLeft: '20px', paddingTop: '4px' }}
            >
              Last Return:
            </Typography>
            {Object.entries(props.outputs).map(output => (
              <div key={output[0]} className={props.classes.div}>
                <Tooltip title={output[1].description}>
                  <IconButton
                    tabIndex="-1"
                    className={props.classes.button}
                    style={{ cursor: 'pointer' }}
                    disableRipple
                    onClick={() =>
                      props.infoClickHandler(
                        props.blockName,
                        props.attributeName,
                        `returns.${output[0]}`
                      )
                    }
                  >
                    <AttributeAlarm
                      alarmSeverity={AlarmStates.NO_ALARM}
                      fieldType={FieldTypes.PARAMOUT}
                    />
                  </IconButton>
                </Tooltip>
                <Typography className={props.classes.textName}>
                  {output[1].label}
                </Typography>
                <div className={props.classes.controlContainer}>
                  {buildIOComponent(output, props, true)}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </GroupExpander>
  );
};

MethodDetails.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  methodName: PropTypes.string.isRequired,
  methodAlarm: PropTypes.number.isRequired,
  methodMessage: PropTypes.string.isRequired,
  methodPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  inputs: PropTypes.shape({}).isRequired,
  inputInfo: PropTypes.shape({}).isRequired,
  inputValues: PropTypes.shape({}).isRequired,
  inputAlarms: PropTypes.shape({}).isRequired,
  outputs: PropTypes.shape({}).isRequired,
  outputValues: PropTypes.shape({}).isRequired,
  runMethod: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    runButton: PropTypes.string,
    controlContainer: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  writeable: PropTypes.bool.isRequired,
};

const EMPTY = '';
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const mapStateToProps = (state, ownProps) => {
  let method;
  if (ownProps.attributeName && ownProps.blockName) {
    method = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }

  const methodDescription =
    method && method.raw.meta.description ? method.raw.meta.description : EMPTY;
  let alarm = AlarmStates.NO_ALARM;
  alarm =
    method && method.calculated.errorState ? AlarmStates.MAJOR_ALARM : alarm;
  alarm = method && method.calculated.dirty ? AlarmStates.DIRTY : alarm;
  alarm =
    method && method.calculated.errorState && method.calculated.dirty
      ? AlarmStates.DIRTYANDERROR
      : alarm;
  alarm = method && method.calculated.pending ? AlarmStates.PENDING : alarm;
  const inputAlarms = {};
  const inputInfo = {};
  if (method && method.raw.meta.takes.elements) {
    Object.entries(method.raw.meta.takes.elements).forEach(([input, meta]) => {
      const inputIsDirty =
        (method.calculated.inputs[input] instanceof Object &&
          Object.prototype.hasOwnProperty.call(
            method.calculated.inputs[input],
            'value'
          )) ||
        (method.calculated.dirtyInputs && method.calculated.dirtyInputs[input]);

      const inputIsErrored = false; // TODO: implement individual parameter errors

      const inputInvalid =
        method.calculated.inputs[input] &&
        method.calculated.inputs[input].flags.invalid;

      inputInfo[input] = meta.description;
      inputAlarms[input] = AlarmStates.NO_ALARM;

      inputInfo[input] = inputInvalid || inputInfo[input];
      inputAlarms[input] = inputInvalid
        ? AlarmStates.MINOR_ALARM
        : inputAlarms[input];

      inputInfo[input] = inputIsDirty ? meta.description : inputInfo[input];
      inputAlarms[input] = inputIsDirty
        ? AlarmStates.DIRTY
        : inputAlarms[input];

      inputInfo[input] = inputIsErrored
        ? `Error in parameter ${input}`
        : inputInfo[input];
      inputAlarms[input] = inputIsErrored
        ? AlarmStates.MAJOR_ALARM
        : inputAlarms[input];

      inputAlarms[input] =
        inputIsDirty && inputIsErrored
          ? AlarmStates.DIRTYANDERROR
          : inputAlarms[input];
    });
  }

  return {
    writeable: method ? method.raw.meta.writeable : false,
    methodName: method ? method.raw.meta.label : 'Not found',
    methodAlarm: alarm,
    methodPending: method ? method.calculated.pending : false,
    methodErrored: method ? method.calculated.errorState : false,
    methodMessage:
      method && method.calculated.errorState
        ? method.calculated.errorMessage
        : methodDescription,
    methodPath: method ? method.calculated.path : EMPTY_ARRAY,
    inputs: method ? method.raw.meta.takes.elements : EMPTY_OBJECT,
    inputValues: (method && method.calculated.inputs) || EMPTY_OBJECT,
    dirtyInputs: (method && method.calculated.dirtyInputs) || EMPTY_OBJECT,
    inputAlarms,
    inputInfo,
    outputs: method ? method.raw.meta.returns.elements : EMPTY_OBJECT,
    outputValues: (method && method.calculated.outputs) || EMPTY_OBJECT,
    required: method ? method.raw.meta.required : EMPTY_OBJECT,
    defaultValues: method ? method.raw.meta.defaults : EMPTY_OBJECT,
  };
};

export const mapDispatchToProps = dispatch => ({
  infoClickHandler: (blockName, attributeName, subElement) => {
    dispatch(
      navigationActions.navigateToInfo(blockName, attributeName, subElement)
    );
  },
  runMethod: (path, inputs) => {
    dispatch(malcolmPostAction(path, inputs));
  },
  updateInput: (path, inputName, inputValue) => {
    dispatch(malcolmUpdateMethodInput(path, inputName, inputValue));
  },
  methodParamClickHandler: path => {
    dispatch(navigationActions.navigateToSubElement(path[0], path[1], path[2]));
  },
  flagInput: (path, param, flagType, flagState) => {
    dispatch(malcolmFlagMethodInput(path, param, flagType, flagState));
  },
  initialiseLocalState: (path, selectedParam) => {
    dispatch(malcolmIntialiseMethodParam(path, selectedParam));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MethodDetails)
);
