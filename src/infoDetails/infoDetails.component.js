import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import InfoElement from './infoElement.component';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavTypes from '../malcolm/NavTypes';
import {
  malcolmPutAction,
  malcolmSetFlag,
} from '../malcolm/malcolmActionCreators';
import { attributeInfo } from './infoBuilders';

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

const InfoDetails = props => {
  const infoElements = Object.keys(props.info).filter(
    a => props.info[a].inline || !(props.info[a] instanceof Object)
  );
  const infoGroups = Object.keys(props.info).filter(
    a => props.info[a] instanceof Object && !props.info[a].inline
  );
  return (
    <div>
      {infoElements.map(a => (
        <InfoElement
          key={a}
          label={props.info[a].label ? props.info[a].label : a}
          value={getValue(props.info[a])}
          alarm={infoAlarmState(props.info[a])}
          tag={getTag(props.info[a])}
          clickHandler={
            a === 'localState'
              ? () => {
                  props.setFlag(props.path, 'forceUpdate', true);
                  props.setFlag(props.path, 'dirty', false);
                  props.eventHandler(props.path, props.value);
                }
              : () => {}
          }
        />
      ))}
      {infoGroups.map(group => (
        <GroupExpander
          key={group}
          groupName={props.info[group].label ? props.info[group].label : group}
          expanded
        >
          {Object.keys(props.info[group])
            .filter(a => !['label', 'typeid'].includes(a))
            .map(a => (
              <InfoElement
                key={a}
                label={
                  props.info[group][a].label ? props.info[group][a].label : a
                }
                value={getValue(props.info[group][a])}
                alarm={infoAlarmState(props.info[group][a])}
                tag={getTag(props.info[group][a])}
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

  const builtInfo = attributeInfo(state, blockName, attributeName);
  return {
    ...builtInfo,
    path: [blockName, attributeName],
  };
};

InfoDetails.propTypes = {
  info: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDetails);
