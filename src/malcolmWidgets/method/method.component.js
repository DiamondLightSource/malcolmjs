import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import AttributeAlarm, {
  AlarmStates,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
import ButtonAction from '../buttonAction/buttonAction.component';
import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmSetFlag,
  malcolmPostAction,
} from '../../malcolm/malcolmActionCreators';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';

import {
  selectorFunction,
  getDefaultFromType,
} from '../attributeDetails/attributeSelector/attributeSelector.component';
import navigationActions from '../../malcolm/actions/navigation.actions';

const styles = () => ({
  div: {
    display: 'flex',
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
  },
  textName: {
    flexGrow: 1,
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  controlContainer: {
    width: 150,
    padding: 2,
  },
  runButton: {
    flexGrow: 1,
    padding: 2,
  },
  missingAttribute: {
    color: 'red',
  },
});

const buildIOComponent = (input, props, isOutput) => {
  const { tags } = input[1];
  const widgetTag = tags.find(t => t.indexOf('widget:') !== -1);
  const flags = {
    isDisabled: props.methodPending || !input[1].writeable,
    isErrorState: props.methodErrored,
    isDirty: props.dirtyInputs[input[0]],
  };
  const updateStoreOnEveryValueChange = true;

  const parameterMeta = {};

  const valueMap = isOutput ? props.outputValues : props.inputValues;
  let inputValue;
  if (valueMap[input[0]] !== undefined) {
    inputValue = valueMap[input[0]];
  } else if (props.defaultValues[input[0]] !== undefined) {
    inputValue = props.defaultValues[input[0]];
  } else {
    inputValue = getDefaultFromType(input[1]);
    if (inputValue !== undefined) {
      props.updateInput(props.methodPath, input[0], inputValue);
    }
  }
  const submitHandler = (path, value) => {
    props.updateInput(path, input[0], value);
  };
  const setFlag = (path, flagName, isDirty) => {
    props.updateInput(path, input[0], { isDirty });
  };
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
      props.methodParamClickHandler
    );
  }
  return selectorFunction('widget:undefined');
};

const MethodDetails = props => (
  <div>
    {Object.entries(props.inputs).map(input => (
      <div key={input[0]} className={props.classes.div}>
        <Tooltip title={props.methodErrorMessage}>
          <div>
            <AttributeAlarm alarmSeverity={props.methodAlarm} />
          </div>
        </Tooltip>
        <Tooltip title={input[1].description}>
          <Typography className={props.classes.textName}>
            {input[1].label}:{' '}
          </Typography>
        </Tooltip>
        <div className={props.classes.controlContainer}>
          {buildIOComponent(input, props, false)}
        </div>
      </div>
    ))}
    <div className={props.classes.div}>
      <AttributeAlarm alarmSeverity={props.methodAlarm} />
      <Typography className={props.classes.textName} />
      <div className={props.classes.controlContainer}>
        <ButtonAction
          text={props.methodName}
          disabled={props.methodAlarm === AlarmStates.PENDING}
          clickAction={() =>
            props.runMethod(props.methodPath, props.inputValues)
          }
        />
      </div>
    </div>
    {Object.keys(props.outputValues).length !== 0 ? (
      <div>
        <Typography className={props.classes.textName}>Last Return:</Typography>
        <Divider />
        {Object.entries(props.outputs).map(output => (
          <div key={output[0]} className={props.classes.div}>
            <AttributeAlarm alarmSeverity={0} />
            <Typography className={props.classes.textName}>
              {output[1].label}:{' '}
            </Typography>
            <div className={props.classes.controlContainer}>
              {buildIOComponent(output, props, true)}
            </div>
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

MethodDetails.propTypes = {
  methodName: PropTypes.string.isRequired,
  methodAlarm: PropTypes.number.isRequired,
  methodErrorMessage: PropTypes.string.isRequired,
  methodPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  inputs: PropTypes.shape({}).isRequired,
  inputValues: PropTypes.shape({}).isRequired,
  outputs: PropTypes.shape({}).isRequired,
  outputValues: PropTypes.shape({}).isRequired,
  runMethod: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    controlContainer: PropTypes.string,
  }).isRequired,
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

  let alarm = AlarmStates.NO_ALARM;
  alarm =
    method && method.calculated.errorState ? AlarmStates.MAJOR_ALARM : alarm;
  alarm = method && method.calculated.pending ? AlarmStates.PENDING : alarm;

  return {
    methodName: method ? method.raw.label : 'Not found',
    methodAlarm: alarm,
    methodPending: method ? method.calculated.pending : false,
    methodErrored: method ? method.calculated.errorState : false,
    methodErrorMessage:
      method && method.calculated.errorMessage
        ? method.calculated.errorMessage
        : EMPTY,
    methodPath: method ? method.calculated.path : EMPTY_ARRAY,
    inputs: method ? method.raw.takes.elements : EMPTY_OBJECT,
    inputValues: (method && method.calculated.inputs) || EMPTY_OBJECT,
    dirtyInputs: (method && method.calculated.dirtyInputs) || EMPTY_OBJECT,
    outputs: method ? method.raw.returns.elements : EMPTY_OBJECT,
    outputValues: (method && method.calculated.outputs) || EMPTY_OBJECT,
    required: method ? method.raw.required : EMPTY_OBJECT,
    defaultValues: method ? method.raw.defaults : EMPTY_OBJECT,
  };
};

export const mapDispatchToProps = dispatch => ({
  runMethod: (path, inputs) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPostAction(path, inputs));
  },
  updateInput: (path, inputName, inputValue) => {
    dispatch(malcolmUpdateMethodInput(path, inputName, inputValue));
  },
  methodParamClickHandler: path => {
    dispatch(navigationActions.navigateToSubElement(path[0], path[1], path[2]));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MethodDetails)
);
