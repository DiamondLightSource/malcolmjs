/* eslint no-underscore-dangle: 0 */
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

// eslint-disable-next-line import/prefer-default-export
export const buildAttributeInfo = props => {
  let value;
  const info = {};
  const { attribute } = props;
  if (attribute && attribute.raw && attribute.raw.meta) {
    if (props.subElement === undefined) {
      info.path = {
        label: 'Attribute path',
        value: `${props.attribute.calculated.path[0]}, ${
          props.attribute.calculated.path[1]
        }`,
        inline: true,
      };
      info.meta = {
        label: 'Meta Data',
        malcolmType: {
          valuePath: 'raw.meta.typeid',
          label: 'Malcolm Type',
          inline: true,
        },
        description: {
          valuePath: 'raw.meta.description',
          label: 'Description',
          inline: true,
        },
        writeable: {
          valuePath: 'raw.meta.writeable',
          label: 'Writeable?',
          inline: true,
          tag: 'widget:led',
        },
      };
      info.malcolmAlarm = {
        label: 'Alarm',
      };
      Object.keys(attribute.raw.alarm).forEach(key => {
        info.malcolmAlarm[key] = {
          label: key,
          inline: true,
          valuePath: `raw.alarm.${key}`,
        };
        if (key === 'severity') {
          info.malcolmAlarm[key].alarmStatePath = 'calculated.alarms.rawAlarm';
        }
      });

      info.malcolmAlarm.message = {
        label: 'message',
        inline: true,
        valuePath: 'raw.alarm.message',
      };

      info.timeStamp = {
        label: 'Time Stamp',
        time: {
          label: 'time',
          inline: true,
          valuePath: 'calculated.timeStamp',
        },
      };
      Object.keys(attribute.raw.timeStamp).forEach(key => {
        info.timeStamp[key] = {
          label: key,
          inline: true,
          valuePath: `raw.timeStamp.${key}`,
        };
      });

      info.errorState = {
        label: 'Error State',
        valuePath: 'calculated.errorMessage',
        inline: true,
        alarmStatePath: 'calculated.alarms.errorState',
      };
      if (
        attribute.raw.meta.tags.some(a =>
          ['widget:table', 'widget:textinput'].includes(a)
        )
      ) {
        info.localState = {
          label: 'Local State',
          value: 'Discard',
          disabledPath: 'NOT.calculated.dirty',
          inline: true,
          tag: 'info:button',
          alarmStatePath: 'calculated.alarms.dirty',
        };
        if (props.revertHandler) {
          info.localState.functions = {
            clickHandler: () => {
              props.revertHandler(props.attribute.calculated.path);
            },
          };
        }
      }
      // eslint-disable-next-line prefer-destructuring
      value = attribute.raw.value;
    } else if (attribute.localState) {
      const row = parseInt(props.subElement[1], 10);
      const rowFlags = attribute.localState.flags.rows[row];
      const isNewRow =
        row >= attribute.raw.value[attribute.localState.labels[0]].length;
      info.localState = {
        label: 'Row local state',
        value: 'Discard',
        disabled: !(rowFlags._dirty || rowFlags._isChanged) || isNewRow,
        inline: true,
        tag: 'info:button',
        alarmState:
          rowFlags._dirty || rowFlags._isChanged ? AlarmStates.DIRTY : null,
      };
      const dataRow = {};
      attribute.localState.labels.forEach(label => {
        dataRow[label] =
          row < attribute.raw.value[label].length
            ? attribute.raw.value[label][row]
            : 'undefined';
      });
      info.rowValue = {
        label: 'Row remote state',
        ...dataRow,
      };
      info.addRowAbove = {
        label: 'Insert row above',
        value: 'Add',
        inline: true,
        tag: 'info:button',
      };
      info.addRowBelow = {
        label: 'Insert row below',
        value: 'Add',
        inline: true,
        tag: 'info:button',
      };
      info.deleteRow = {
        label: 'Delete row',
        value: 'Delete',
        inline: true,
        tag: 'info:button',
      };
      if (props.addRow) {
        info.addRowAbove.functions = {
          clickHandler: () => {
            props.addRow(props.attribute.calculated.path, row);
            props.changeInfoHandler(
              props.attribute.calculated.path,
              `row.${row + 1}`
            );
          },
        };
        info.addRowBelow.functions = {
          clickHandler: () => {
            props.addRow(props.attribute.calculated.path, row, 'below');
          },
        };
        info.deleteRow.functions = {
          clickHandler: () => {
            if (row >= props.attribute.localState.value.length - 1) {
              if (row !== 0) {
                props.changeInfoHandler(
                  props.attribute.calculated.path,
                  `row.${row - 1}`
                );
              } else {
                props.closeInfoHandler(props.attribute.calculated.path);
              }
            }
            props.addRow(props.attribute.calculated.path, row, 'delete');
          },
        };
      }
      if (props.rowRevertHandler) {
        info.localState.functions = {
          clickHandler: () => {
            props.rowRevertHandler(
              props.attribute.calculated.path,
              dataRow,
              row
            );
          },
        };
      }
      info.subElement = props.subElement;
    }
  } else if (
    attribute &&
    attribute.calculated &&
    attribute.calculated.isMethod
  ) {
    if (props.subElement === undefined) {
      info.path = {
        label: 'Attribute path',
        value: `${attribute.calculated.path[0]}, ${
          attribute.calculated.path[1]
        }`,
        inline: true,
      };
      info.meta = {
        label: 'Meta Data',
        malcolmType: {
          value: attribute.raw.typeid,
          label: 'Malcolm Type',
          inline: true,
        },
        description: {
          value: attribute.raw.description,
          label: 'Description',
          inline: true,
        },
        writeable: {
          value: attribute.raw.writeable,
          label: 'Writeable?',
          inline: true,
          tag: 'widget:led',
        },
      };
      info.takes = { label: 'Input parameter types' };
      Object.keys(attribute.raw.takes.elements).forEach(input => {
        info.takes[input] = {
          label: attribute.raw.takes.elements[input].label,
          value: attribute.raw.takes.elements[input].typeid,
          infoPath: {
            root: attribute.calculated.path,
            subElement: `takes.${input}`,
          },
        };
      });

      info.returns = { label: 'Output parameter types' };
      Object.keys(attribute.raw.returns.elements).forEach(input => {
        info.returns[input] = {
          label: attribute.raw.returns.elements[input].label,
          value: attribute.raw.returns.elements[input].typeid,
          infoPath: {
            root: attribute.calculated.path,
            subElement: `returns.${input}`,
          },
        };
      });
      info.errorState = {
        label: 'Error State',
        inline: true,
        value: attribute.calculated.errorState
          ? attribute.calculated.errorMessage
          : 'n/a',
        alarmState: attribute.calculated.errorState
          ? AlarmStates.MAJOR_ALARM
          : null,
      };
    } else {
      const rawInfo =
        attribute.raw[props.subElement[0]].elements[props.subElement[1]];
      Object.keys(rawInfo).forEach(key => {
        info[key] = rawInfo[key];
      });
    }
  }
  return { info, value };
};

export const linkInfo = props => {
  const portAttribute = props.attribute;

  if (!portAttribute || !portAttribute.raw.value) {
    return { ...props, info: {}, value: {} };
  }

  const blockMri = props.attribute.calculated.path[0];
  const blockName = props.linkBlockName;
  const portName = props.attribute.calculated.path[1];

  const portNullValue = portAttribute.raw.meta.tags
    .find(t => t.indexOf('inport:') > -1)
    .split(':')
    .slice(-1)[0];

  const info = {
    sourcePort: {
      label: 'Source',
      valuePath: 'raw.value',
      inline: true,
      tag: portAttribute.raw.meta.choices ? 'widget:combo' : 'widget:textinput',
      choices: portAttribute.raw.meta.choices,
      functions: {
        eventHandler: (nullPath, value) =>
          props.eventHandler([blockMri, portName, 'value'], value),
      },
    },
    destinationPort: {
      label: 'Destination',
      value: `${blockName}.${portName}`,
      inline: true,
    },
    deleteLink: {
      label: '',
      value: 'Delete',
      inline: true,
      tag: 'info:button',
      showLabel: false,
      functions: {
        clickHandler: () => {
          props.eventHandler([blockMri, portName, 'value'], portNullValue);
        },
      },
    },
  };

  return {
    info,
    value: {},
  };
};
