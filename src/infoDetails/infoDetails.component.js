import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import InfoElement from './infoElement.component';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavTypes from '../malcolm/NavTypes';
import {
  malcolmPutAction,
  malcolmSetFlag,
  malcolmRevertAction,
  malcolmUpdateTable,
} from '../malcolm/malcolmActionCreators';
import { buildAttributeInfo } from './infoBuilders';
import blockUtils from '../malcolm/blockUtils';
import navigationActions from '../malcolm/actions/navigation.actions';

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

export class InfoDetails extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.attribute &&
      props.attribute.raw &&
      props.attribute.raw.timeStamp &&
      (props.attribute.raw.timeStamp.secondsPastEpoch !== state.lastUpdate ||
        props.subElement !== state.subElement)
    ) {
      return {
        lastUpdate: props.attribute.raw.timeStamp.secondsPastEpoch,
        subElement: props.subElement,
      };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = { lastUpdate: -1, subElement: undefined };
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.subElement !== this.state.subElement ||
      (nextProps.attribute &&
        nextProps.attribute.raw &&
        nextProps.attribute.raw.timeStamp &&
        nextProps.attribute.raw.timeStamp.secondsPastEpoch !==
          this.state.lastUpdate)
    );
  }

  render() {
    const updatedProps = buildAttributeInfo(this.props);
    const infoElements = Object.keys(updatedProps.info).filter(
      a =>
        updatedProps.info[a].inline || !(updatedProps.info[a] instanceof Object)
    );
    const infoGroups = Object.keys(updatedProps.info).filter(
      a =>
        updatedProps.info[a] instanceof Object && !updatedProps.info[a].inline
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
  }
}

InfoDetails.propTypes = {
  subElement: PropTypes.arrayOf(PropTypes.string).isRequired,
  attribute: PropTypes.shape({
    raw: PropTypes.shape({
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.number,
      }),
    }),
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  changeInfoHandler: (path, subElement) => {
    dispatch(
      navigationActions.navigateToSubElement(path[0], path[1], subElement)
    );
  },
  infoClickHandler: (path, subElement) => {
    dispatch(navigationActions.navigateToInfo(path[0], path[1], subElement));
  },
  closeInfoHandler: path => {
    dispatch(navigationActions.navigateToAttribute(path[0], path[1]));
  },
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
  rowRevertHandler: (path, value, row) => {
    dispatch(malcolmUpdateTable(path, value, row));
  },
  addRow: (path, row, modifier) => {
    dispatch(malcolmUpdateTable(path, { insertRow: true, modifier }, row));
  },
});

const mapStateToProps = state => {
  let blockName;
  let attributeName;
  let subElement;
  const navLists = state.malcolm.navigation.navigationLists.slice(-3);
  if (navLists[2].navType === NavTypes.Info) {
    blockName =
      navLists[0].navType === NavTypes.Block ? navLists[0].blockMri : undefined;
    attributeName =
      navLists[1].navType === NavTypes.Attribute ? navLists[1].path : undefined;
    subElement =
      navLists[1].navType === NavTypes.Attribute && navLists[1].subElements
        ? navLists[1].subElements
        : undefined;
  }
  return {
    attribute: blockUtils.findAttribute(
      state.malcolm.blocks,
      blockName,
      attributeName
    ),
    subElement,
    // path: [blockName, attributeName],
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDetails);
