import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../malcolm/blockUtils';

export const addHandlersToInfoItems = inputProps => {
  const props = inputProps;
  if (props.setFlag && props.eventHandler) {
    if (props.info && props.info.localState) {
      props.info.localState.functions = {
        clickHandler: () => {
          props.setFlag(props.path, 'forceUpdate', true);
          props.setFlag(props.path, 'dirty', false);
          props.eventHandler(props.path, props.value);
        },
      };
    }
  }
  return props;
};

export const attributeInfo = (state, blockName, attributeName) => {
  let value;
  const info = {};
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    blockName,
    attributeName
  );
  if (attribute && attribute.raw && attribute.raw.meta) {
    info.meta = {
      label: 'Meta Data',
      malcolmType: {
        value: attribute.raw.meta.typeid,
        label: 'Malcolm Type',
      },
      description: {
        value: attribute.raw.meta.description,
        label: 'Description',
      },
    };
    info.malcolmAlarm = {
      label: 'Malcolm Alarm',
      ...attribute.raw.alarm,
      message: attribute.raw.alarm.message
        ? attribute.raw.alarm.message
        : 'n/a',
    };
    info.timeStamp = {
      label: 'Time Stamp',
      time: `${new Date(attribute.raw.timeStamp.secondsPastEpoch * 1000)}`,
      ...attribute.raw.timeStamp,
    };
    info.errorState = {
      label: 'Error State',
      value: attribute.calculated.errorMessage
        ? attribute.calculated.errorMessage
        : 'n/a',
      inline: true,
      alarmState: attribute.calculated.errorState
        ? AlarmStates.MAJOR_ALARM
        : null,
    };
    if (
      attribute.raw.meta.tags.some(a =>
        ['widget:table', 'widget:textinput'].includes(a)
      )
    ) {
      info.localState = {
        label: 'Local State',
        value: {
          buttonLabel: 'Discard',
          disabled: !attribute.calculated.dirty,
        },
        inline: true,
        tag: 'info:button',
        alarmState: attribute.calculated.dirty ? AlarmStates.DIRTY : null,
      };
    }
    // eslint-disable-next-line prefer-destructuring
    value = attribute.raw.value;
  }
  return { info, value };
};
