/* eslint react/no-array-index-key: 0 */
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
  malcolmRevertAction,
  malcolmUpdateTable,
  malcolmSelectLink,
  malcolmGetAction,
  clearError,
} from '../malcolm/malcolmActionCreators';
import { malcolmClearMethodInput } from '../malcolm/actions/method.actions';
import { buildAttributeInfo, linkInfo } from './infoBuilders';
import blockUtils from '../malcolm/blockUtils';
import navigationActions from '../malcolm/actions/navigation.actions';
import { idSeparator } from '../layout/layout.component';

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
        a =>
          ![
            'value',
            'valuePath',
            'alarmState',
            'alarmStatePath',
            'disabled',
            'disabledPath',
            'label',
            'showLabel',
            'tag',
            'inline',
            'functions',
            'choices',
          ].includes(a)
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
  } else if (Object.prototype.hasOwnProperty.call(value, 'value')) {
    return value.value;
  } else if (value.valuePath !== undefined) {
    return undefined;
  }
  return Object.values(value)[0];
};

export class InfoDetails extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.blockName !== state.blockName ||
      props.attributeName !== state.attributeName ||
      (props.subElement && props.subElement !== state.subElement) ||
      (props.subElement && props.subElement[0] === 'row') ||
      (props.linkBlockName && props.linkBlockName !== state.subElement) ||
      props.isMethodInfo ||
      props.isLinkInfo ||
      Object.keys(state.info).length === 0 ||
      props.isLayoutLocked !== state.isLayoutLocked
    ) {
      let newState;
      let subElement;
      if (props.isLinkInfo) {
        subElement = props.linkBlockName;
        newState = linkInfo(props);
      } else {
        newState = buildAttributeInfo(props);
        // eslint-disable-next-line prefer-destructuring
        subElement = props.subElement;
      }
      return {
        ...newState,
        blockName: props.blockName,
        attributeName: props.attributeName,
        subElement,
        isLinkInfo: !!props.isLinkInfo,
        isLayoutLocked: props.isLayoutLocked,
      };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
    if (props.info) {
      this.state.info = { ...props.info };
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.blockName !== this.state.blockName ||
      nextProps.attributeName !== this.state.attributeName ||
      (!!nextProps.subElement &&
        (nextProps.subElement !== this.state.subElement ||
          nextProps.subElement[0] === 'row' ||
          nextProps.subElement[0] === 'col')) ||
      (!!nextProps.linkBlockName &&
        nextProps.linkBlockName !== this.state.subElement) ||
      nextProps.isMethodInfo ||
      nextProps.isLinkInfo ||
      Object.keys(this.state.info).length === 0 ||
      nextProps.isLayoutLocked !== this.props.isLayoutLocked
    );
  }

  render() {
    const infoElements = Object.keys(this.state.info).filter(
      a => this.state.info[a].inline || !(this.state.info[a] instanceof Object)
    );
    const infoGroups = Object.keys(this.state.info).filter(
      a => this.state.info[a] instanceof Object && !this.state.info[a].inline
    );
    return (
      <div>
        {infoElements.map(a => (
          <InfoElement
            key={a}
            label={this.state.info[a].label ? this.state.info[a].label : a}
            value={getValue(this.state.info[a])}
            valuePath={
              this.state.info[a].valuePath
                ? this.state.info[a].valuePath
                : undefined
            }
            alarm={infoAlarmState(this.state.info[a])}
            alarmPath={
              this.state.info[a].alarmStatePath
                ? this.state.info[a].alarmStatePath
                : undefined
            }
            tag={getTag(this.state.info[a])}
            handlers={this.state.info[a].functions}
            choices={this.state.info[a].choices}
            showLabel={this.state.info[a].showLabel}
            blockName={this.props.blockName}
            attributeName={this.props.attributeName}
            disabled={this.state.info[a].disabled}
            disabledFlagPath={this.state.info[a].disabledPath}
          />
        ))}
        {infoGroups.map((group, groupIndex) => (
          <GroupExpander
            key={groupIndex}
            groupName={
              this.state.info[group].label
                ? this.state.info[group].label
                : group
            }
            expanded
          >
            {Object.keys(this.state.info[group])
              .filter(a => !['label', 'typeid'].includes(a))
              .map((a, aIndex) => (
                <InfoElement
                  key={aIndex}
                  label={
                    this.state.info[group][a].label
                      ? this.state.info[group][a].label
                      : a
                  }
                  value={getValue(this.state.info[group][a])}
                  valuePath={
                    this.state.info[group][a].valuePath
                      ? this.state.info[group][a].valuePath
                      : undefined
                  }
                  alarm={infoAlarmState(this.state.info[group][a])}
                  alarmPath={
                    this.state.info[group][a].alarmStatePath
                      ? this.state.info[group][a].alarmStatePath
                      : undefined
                  }
                  tag={getTag(this.state.info[group][a])}
                  blockName={this.props.blockName}
                  attributeName={this.props.attributeName}
                  disabled={this.state.info[group][a].disabled}
                  disabledFlagPath={this.state.info[group][a].disabledPath}
                  handlers={this.state.info[group][a].functions}
                  showLabel={this.state.info[group][a].showLabel}
                  infoPath={this.state.info[group][a].infoPath}
                  infoClickHandler={this.props.infoClickHandler}
                />
              ))}
          </GroupExpander>
        ))}
      </div>
    );
  }
}

InfoDetails.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  subElement: PropTypes.arrayOf(PropTypes.string),
  linkBlockName: PropTypes.string.isRequired,
  info: PropTypes.shape({}),
  infoClickHandler: PropTypes.func.isRequired,
  isMethodInfo: PropTypes.bool.isRequired,
  isLinkInfo: PropTypes.bool.isRequired,
  // isLinkInfo: PropTypes.bool.isRequired,
  isLayoutLocked: PropTypes.bool.isRequired,
};

InfoDetails.defaultProps = {
  subElement: undefined,
  info: undefined,
};

const deselectLinkAction = path => (dispatch, getState) => {
  const { selectedLinks } = getState().malcolm.layoutState;
  const matchingSelectedLink = selectedLinks.find(l =>
    l.endsWith(path[0] + idSeparator + path[1])
  );

  if (matchingSelectedLink) {
    dispatch(malcolmSelectLink(matchingSelectedLink, false));
  }
};

const mapDispatchToProps = dispatch => ({
  getBlock: path => {
    dispatch(malcolmGetAction(path));
  },
  changeInfoHandler: (path, subElement) => {
    dispatch(
      navigationActions.navigateToSubElement(path[0], path[1], subElement)
    );
  },
  infoClickHandler: (path, subElement) => {
    dispatch(navigationActions.navigateToInfo(path[0], path[1], subElement));
  },
  closeInfoHandler: (path, subElement) => {
    dispatch(navigationActions.closeInfo(path[0], path[1], subElement));
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
  moveRow: (path, row, modifier) => {
    dispatch(malcolmUpdateTable(path, { moveRow: true, modifier }, row));
  },
  unselectLink: path => {
    dispatch(deselectLinkAction(path));
  },
  clearParamState: (path, param) => {
    dispatch(malcolmClearMethodInput(path, param));
  },
  clearError: path => {
    dispatch(clearError(path));
  },
});

const mapStateToProps = state => {
  let blockName;
  let attributeName;
  let subElement;
  let layoutAttribute;
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

  const showLinkInfo = navLists[2].path.endsWith('.link');
  let linkBlockName;
  if (showLinkInfo) {
    layoutAttribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      state.malcolm.parentBlock,
      state.malcolm.mainAttribute
    );

    if (layoutAttribute && layoutAttribute.raw.value) {
      const blockNameIndex = layoutAttribute.raw.value.name.findIndex(
        n => n === navLists[2].linkInputBlock
      );

      blockName = layoutAttribute.raw.value.mri[blockNameIndex];
      attributeName = navLists[2].linkInputPort;
      linkBlockName = navLists[2].linkInputBlock;
    }
  }

  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    blockName,
    attributeName
  );

  return {
    attribute,
    blockName,
    attributeName,
    subElement,
    isLinkInfo: showLinkInfo,
    layoutAttribute: showLinkInfo ? layoutAttribute : undefined,
    isMethodInfo:
      attribute && attribute.calculated && attribute.calculated.isMethod,
    linkBlockName,
    isLayoutLocked: state.malcolm.layout && state.malcolm.layout.locked,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoDetails);
