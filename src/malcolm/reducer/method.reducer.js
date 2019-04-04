import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import {
  MalcolmUpdateMethodInputType,
  MalcolmMethodReturn,
  MalcolmArchiveMethodRun,
  MalcolmFlagMethodInputType,
} from '../malcolm.types';
import { timestamp2Date } from './attribute.reducer';
import {
  isArrayType,
  malcolmTypes,
} from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

export const Sources = {
  LOCAL: 'methodrun:local',
  REMOTE: 'methodrun:remote',
};

export const getMethodParam = (type, param, method) =>
  Object.keys(method.raw.meta[type].elements).includes(`${param}`);

const mapReturnValues = (returnKeys, payload) => {
  const valueMap = { outputs: {} };
  returnKeys.forEach(returnVar => {
    if (payload.value[returnVar] !== undefined) {
      valueMap.outputs[returnVar] = payload.value[returnVar];
    } else {
      valueMap.errorState = true;
      valueMap.errorMessage = `MethodError: expected value ${returnVar} missing from return`;
    }
  });
  return valueMap;
};

export const pushServerRunToArchive = (methodArchive, payload) => {
  const updatedArchive = { ...methodArchive };
  if (
    !(
      payload.raw.took.timeStamp.secondsPastEpoch === 0 &&
      payload.raw.took.timeStamp.secondsPastEpoch === 0
    )
  ) {
    // if both timestamp fields are zero delta didn't actually contain any run information
    const took = {};
    payload.raw.took.present.forEach(param => {
      took[param] = payload.raw.took.value[param];
    });
    updatedArchive.value.push({
      took,
      calledWith: [...payload.raw.took.present],
      returned: { ...payload.raw.returned.value },
      returnStatus: 'OK',
      source: Sources.REMOTE,
    });
    updatedArchive.timeStamp.push({
      runTime: timestamp2Date(payload.raw.took.timeStamp),
      returnTime: timestamp2Date(payload.raw.returned.timeStamp),
    });
    updatedArchive.alarmState.push(
      Math.max(
        payload.raw.took.alarm.severity,
        payload.raw.returned.alarm.severity
      )
    );
  }
  return updatedArchive;
};

const pushParamsToArchive = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blockArchive = { ...state.blockArchive };
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blockArchive[blockName];
    const archive = attributes[matchingAttribute];
    const attribute = { ...blocks[blockName].attributes[matchingAttribute] };
    attribute.calculated.lastCallId = archive.value.size();
    archive.value.push({
      took: payload.parameters,
      returned: null,
      source: Sources.LOCAL,
    });
    archive.timeStamp.push({ runTime: new Date() });
    archive.alarmState.push({ alarm: AlarmStates.UNDEFINED_ALARM });
    attributes[matchingAttribute] = archive;
    blockArchive[blockName] = {
      ...state.blockArchive[payload.path[0]],
      attributes,
    };
    blocks[blockName].attributes[matchingAttribute] = attribute;
  }
  return {
    ...state,
    blockArchive,
    blocks,
  };
};

const updateMethodInput = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blocks[blockName];
    const attributeCopy = attributes[matchingAttribute];
    const archive =
      state.blockArchive[blockName] &&
      state.blockArchive[blockName].attributes[matchingAttribute];
    if (payload.doInitialise) {
      if (isArrayType(attributeCopy.raw.meta.takes.elements[payload.name])) {
        attributeCopy.calculated.inputs[payload.name] = {
          meta: {
            ...attributeCopy.raw.meta.takes.elements[payload.name],
          },
          value: [],
          flags: {
            rows: [],
          },
        };
      } else if (
        attributeCopy.raw.meta.defaults[payload.name] &&
        attributeCopy.raw.meta.takes.elements[payload.name].typeid ===
          malcolmTypes.table
      ) {
        const labels = Object.keys(
          attributeCopy.raw.meta.takes.elements[payload.name].elements
        );
        const columns = {};
        labels.forEach(label => {
          columns[label] = {};
        });
        console.log(attributeCopy.raw.meta.defaults[payload.name][labels[0]]);
        attributeCopy.calculated.inputs[payload.name] = {
          meta: JSON.parse(
            JSON.stringify(attributeCopy.raw.meta.takes.elements[payload.name])
          ),
          value: attributeCopy.raw.meta.defaults[payload.name][labels[0]].map(
            (value, row) => {
              const dataRow = {};
              labels.forEach(label => {
                dataRow[label] =
                  attributeCopy.raw.meta.defaults[payload.name][label][row];
              });
              return dataRow;
            }
          ),
          labels,
          flags: {
            columns,
            rows: attributeCopy.raw.meta.defaults[payload.name][labels[0]].map(
              () => ({})
            ),
            table: {},
          },
        };
        console.log('#########################');
        console.log(attributeCopy.raw.meta.defaults[payload.name]);
        console.log(attributeCopy.raw.meta);
      }
    } else if (payload.delete) {
      attributeCopy.calculated.inputs = {
        ...attributeCopy.calculated.inputs,
      };
      delete attributeCopy.calculated.inputs[payload.name];
    } else {
      attributeCopy.calculated.inputs = {
        ...attributeCopy.calculated.inputs,
      };
      attributeCopy.calculated.inputs[payload.name] = attributeCopy.calculated
        .inputs[payload.name]
        ? {
            ...attributeCopy.calculated.inputs[payload.name],
            value: payload.value,
          }
        : { value: payload.value, flags: {} };
    }
    attributeCopy.calculated.dirty =
      archive &&
      ((archive.value.size() === 0 &&
        Object.keys(attributeCopy.calculated.inputs).length !== 0) || // Method hasn't been run but there are input params set
        (archive.value.size() !== 0 &&
          ((archive.value.get(archive.value.size() - 1).runParameters &&
            attributeCopy.calculated.inputs[payload.name] !== undefined &&
            archive.value.get(archive.value.size() - 1).runParameters[
              payload.name
            ].value !== attributeCopy.calculated.inputs[payload.name].value) || // Method run and input params set, check if current value is equal to that of last run
            !archive.value.get(archive.value.size() - 1).runParameters))); // Method was run with no params sent (?)
    attributes[matchingAttribute] = attributeCopy;
    blocks[payload.path[0]] = { ...state.blocks[payload.path[0]], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const setInputFlag = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blocks[blockName];
    const attributeCopy = attributes[matchingAttribute];
    if (payload.flagType === 'dirty') {
      if (!attributeCopy.calculated.dirtyInputs) {
        attributeCopy.calculated.dirtyInputs = {};
      }
      attributeCopy.calculated.dirtyInputs = {
        ...attributeCopy.calculated.dirtyInputs,
      };
      attributeCopy.calculated.dirtyInputs[payload.name] = payload.flagState;
    }
    const flags = {};
    flags[payload.flagType] = payload.flagState;
    attributeCopy.calculated.inputs[payload.name] = {
      ...attributeCopy.calculated.inputs[payload.name],
      flags,
    };
    attributes[matchingAttribute] = attributeCopy;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }

  return {
    ...state,
    blocks,
  };
};

export const handleMethodReturn = (state, payload) => {
  const matchingMessage = state.messagesInFlight[payload.id];
  const path = matchingMessage ? matchingMessage.path : undefined;

  if (path && matchingMessage.typeid === 'malcolm:core/Post:1.0') {
    const blockName = path[0];
    const attributeName = path[1];
    const matchingAttribute = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    const blocks = { ...state.blocks };
    const blockArchive = { ...state.blockArchive };
    if (matchingAttribute >= 0) {
      const { attributes } = blocks[blockName];
      const attribute = attributes[matchingAttribute];
      let valueMap = { outputs: {} };
      if (payload.typeid === 'malcolm:core/Return:1.0') {
        const returnKeys = Object.keys(attribute.raw.meta.returns.elements);
        if (blockUtils.attributeHasTag(attribute, 'method:return:unpacked')) {
          valueMap.outputs[returnKeys[0]] = payload.value;
        } else {
          valueMap = mapReturnValues(returnKeys, payload);
        }
        attribute.calculated.outputs = {};
        returnKeys.forEach(param => {
          attribute.calculated.outputs[param] = {
            value: valueMap.outputs[param],
          };
        });
        if (valueMap.errorState)
          attribute.calculated.errorState = valueMap.errorState;
        if (valueMap.errorMessage)
          attribute.calculated.errorMessage = valueMap.errorMessage;
      }
      attributes[matchingAttribute] = attribute;

      const archive = blockArchive[blockName].attributes;
      if (archive && archive[matchingAttribute]) {
        const runParams = archive[matchingAttribute].value.get(
          matchingMessage.senderLookupID
        );
        const runTime = archive[matchingAttribute].timeStamp.get(
          matchingMessage.senderLookupID
        );
        const alarm = archive[matchingAttribute].alarmState.get(
          matchingMessage.senderLookupID
        );
        runParams.returned = { ...valueMap.outputs };
        runParams.returnStatus =
          payload.typeid === 'malcolm:core/Return:1.0'
            ? 'Run success'
            : 'Run failed';
        if (payload.message) runParams.returnStatus += ` (${payload.message})`;
        runTime.returnTime = new Date();
        alarm.alarm = AlarmStates.NO_ALARM;
        blockArchive[blockName] = {
          ...state.blockArchive[blockName],
          attributes: archive,
        };
      }
      blocks[blockName] = { ...state.blocks[blockName], attributes };
    }
    return {
      ...state,
      blocks,
      blockArchive,
    };
  }
  return state;
};

const MethodReducer = createReducer(
  {},
  {
    [MalcolmUpdateMethodInputType]: updateMethodInput,
    [MalcolmMethodReturn]: handleMethodReturn,
    [MalcolmArchiveMethodRun]: pushParamsToArchive,
    [MalcolmFlagMethodInputType]: setInputFlag,
  }
);

export default MethodReducer;
