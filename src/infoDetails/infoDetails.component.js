import React from 'react';
import { connect } from 'react-redux';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import InfoElement from './infoElement.component';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavTypes from '../malcolm/NavTypes';
import {
  malcolmPutAction,
  malcolmSetFlag,
  malcolmRevertAction,
} from '../malcolm/malcolmActionCreators';
import {
  attributeInfo,
  addHandlersToInfoItems,
  linkInfo,
} from './infoBuilders';

const getTag = element => {
  if (element && element.tag) {
    return element.tag;
  }
  return 'info:multiline';
};

const infoAlarmState = value => {
  if (value instanceof Object) {
    if (value.alarmState !== undefined) {
      return value.alarmState;
    } else if (
      Object.keys(value).some(
        a => !['value', 'label', 'tag', 'inline', 'functions'].includes(a)
      )
    ) {
      return AlarmStates.NO_ALARM;
    }
  }
  return null;
};

const getValue = value => {
  if (!(value instanceof Object)) {
    return value;
  } else if (value.value !== undefined) {
    return value.value;
  }
  return Object.values(value)[0];
};

export const InfoDetails = props => {
  const updatedProps = addHandlersToInfoItems(props);
  const infoElements = Object.keys(updatedProps.info).filter(
    a =>
      updatedProps.info[a].inline || !(updatedProps.info[a] instanceof Object)
  );
  const infoGroups = Object.keys(updatedProps.info).filter(
    a => updatedProps.info[a] instanceof Object && !updatedProps.info[a].inline
  );
  return (
    <div>
      {infoElements.map(a => (
        <InfoElement
          key={a}
          label={updatedProps.info[a].label ? updatedProps.info[a].label : a}
          value={getValue(updatedProps.info[a])}
          alarm={infoAlarmState(updatedProps.info[a])}
          tag={getTag(updatedProps.info[a])}
          handlers={updatedProps.info[a].functions}
          choices={updatedProps.info[a].choices}
          path={updatedProps.info[a].path}
          showLabel={updatedProps.info[a].showLabel}
        />
      ))}
      {infoGroups.map(group => (
        <GroupExpander
          key={group}
          groupName={
            updatedProps.info[group].label
              ? updatedProps.info[group].label
              : group
          }
          expanded
        >
          {Object.keys(updatedProps.info[group])
            .filter(a => !['label', 'typeid'].includes(a))
            .map(a => (
              <InfoElement
                key={a}
                label={
                  updatedProps.info[group][a].label
                    ? updatedProps.info[group][a].label
                    : a
                }
                value={getValue(updatedProps.info[group][a])}
                alarm={infoAlarmState(updatedProps.info[group][a])}
                tag={getTag(updatedProps.info[group][a])}
              />
            ))}
        </GroupExpander>
      ))}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  setFlag: (path, flag, state) => {
    dispatch(malcolmSetFlag(path, flag, state));
  },
  revertHandler: path => {
    dispatch(malcolmRevertAction(path));
  },
  eventHandler: (path, value) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, value));
  },
});

const mapStateToProps = state => {
  let blockName;
  let attributeName;
  const navLists = state.malcolm.navigation.navigationLists.slice(-3);
  if (navLists[2].navType === NavTypes.Info) {
    blockName =
      navLists[0].navType === NavTypes.Block ? navLists[0].blockMri : '';
    attributeName =
      navLists[1].navType === NavTypes.Attribute ? navLists[1].path : '';
  }

  let builtInfo;
  if (navLists[2].path.endsWith('.link')) {
    console.log(navLists[2].linkInputBlock);
    console.log(navLists[2].linkInputPort);

    builtInfo = linkInfo(
      state,
      navLists[2].linkInputBlock,
      navLists[2].linkInputPort
    );
  } else {
    builtInfo = attributeInfo(state, blockName, attributeName);
  }

  return {
    ...builtInfo,
    path: [blockName, attributeName],
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDetails);
