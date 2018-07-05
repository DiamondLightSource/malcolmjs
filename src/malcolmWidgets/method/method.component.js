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

import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

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

const widgetDefaultValues = {
  'widget:textinput': '',
  'widget:textupdate': '...',
  'widget:checkbox': false,
  'widget:led': false,
};

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

  const defaultValue =
    props.defaultValues[input[0]] !== undefined
      ? props.defaultValues[input[0]].toString()
      : null;
  const valueMap = isOutput ? props.outputValues : props.inputValues;
  const inputValue =
    valueMap[input[0]] || defaultValue || widgetDefaultValues[widgetTag];

  const submitHandler = (path, value) => {
    props.updateInput(path, input[0], value);
  };
  const setFlag = (path, flagName, isDirty) => {
    props.updateInput(path, input[0], { isDirty });
  };

  if (widgetTag) {
    return selectorFunction(
      widgetTag,
      props.methodPath,
      inputValue,
      submitHandler,
      flags,
      setFlag,
      props.theme.palette.primary.light,
      parameterMeta,
      false,
      updateStoreOnEveryValueChange
    );
  }
  return null;
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
  alarm = method && method.errorState ? AlarmStates.MAJOR_ALARM : alarm;
  alarm = method && method.pending ? AlarmStates.PENDING : alarm;

  return {
    methodName: method ? method.label : 'Not found',
    methodAlarm: alarm,
    methodPending: method ? method.pending : false,
    methodErrored: method ? method.errorState : false,
    methodErrorMessage:
      method && method.errorMessage ? method.errorMessage : '',
    methodPath: method ? method.path : [],
    inputs: method ? method.takes.elements : {},
    inputValues: (method && method.inputs) || {},
    dirtyInputs: (method && method.dirtyInputs) || {},
    outputs: method ? method.returns.elements : {},
    outputValues: (method && method.outputs) || {},
    required: method ? method.required : {},
    defaultValues: method ? method.defaults : {},
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
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MethodDetails)
);
