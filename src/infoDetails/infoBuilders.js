import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../malcolm/blockUtils';

export const addHandlersToInfoItems = inputProps => {
  const props = inputProps;
  if (props.revertHandler) {
    if (props.info && props.info.localState) {
      props.info.localState.functions = {
        clickHandler: () => {
          props.revertHandler(props.path);
        },
      };
    }
  }

  if (props.info && props.info.sourcePort) {
    props.info.sourcePort.functions.eventHandler = props.eventHandler;
  }

  if (props.info && props.info.deleteLink) {
    props.info.deleteLink.functions.clickHandler = () => {
      props.eventHandler(
        props.info.deleteLink.path,
        props.info.deleteLink.nullValue
      );
    };
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
    info.path = {
      label: 'Attribute path',
      value: `${blockName}, ${attributeName}`,
      inline: true,
    };
    info.meta = {
      label: 'Meta Data',
      malcolmType: {
        value: attribute.raw.meta.typeid,
        label: 'Malcolm Type',
        inline: true,
      },
      description: {
        value: attribute.raw.meta.description,
        label: 'Description',
        inline: true,
      },
      writeable: {
        value: attribute.raw.meta.writeable,
        label: 'Writeable?',
        inline: true,
        tag: 'widget:led',
      },
    };
    info.malcolmAlarm = {
      label: 'Alarm',
      ...attribute.raw.alarm,
      severity: {
        label: 'severity',
        inline: true,
        value: attribute.raw.alarm.severity,
        alarmState:
          attribute.raw.alarm.severity !== AlarmStates.NO_ALARM
            ? attribute.raw.alarm.severity
            : null,
      },
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

export const linkInfo = (state, blockName, portName) => {
  const layoutAttribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    state.malcolm.parentBlock,
    state.malcolm.mainAttribute
  );

  if (!layoutAttribute || !layoutAttribute.raw.value) {
    return { info: {}, value: {} };
  }

  const blockNameIndex = layoutAttribute.raw.value.name.findIndex(
    n => n === blockName
  );
  const blockMri = layoutAttribute.raw.value.mri[blockNameIndex];

  const portAttribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    blockMri,
    portName
  );

  if (!portAttribute || !portAttribute.raw.value) {
    return { info: {}, value: {} };
  }

  const portNullValue = portAttribute.raw.meta.tags
    .find(t => t.indexOf('inport:') > -1)
    .split(':')
    .slice(-1)[0];

  const info = {
    sourcePort: {
      label: 'Source',
      value: portAttribute.raw.value,
      inline: true,
      tag: 'widget:combo',
      choices: portAttribute.raw.meta.choices,
      functions: {},
      path: [blockMri, portName, 'value'],
    },
    destinationPort: {
      label: 'Destination',
      value: `${blockName}.${portName}`,
      inline: true,
    },
    deleteLink: {
      label: '',
      value: {
        buttonLabel: 'Delete',
      },
      inline: true,
      tag: 'info:button',
      showLabel: false,
      functions: {},
      path: [blockMri, portName, 'value'],
      nullValue: portNullValue,
    },
  };

  return {
    info,
    value: {},
  };
};
