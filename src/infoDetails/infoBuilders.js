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
        time: new Date(
          attribute.raw.timeStamp.secondsPastEpoch * 1000
        ).toISOString(),
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
      info.localState = {
        label: 'Row local state',
        value: {
          buttonLabel: 'Discard',
          disabled: !(rowFlags._dirty || rowFlags._isChanged),
        },
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
            : 'n/a';
      });
      info.rowValue = {
        label: 'Row remote state',
        ...dataRow,
      };
      info.addRowAbove = {
        label: 'Insert row above',
        value: {
          buttonLabel: 'Add',
          disabled: false,
        },
        inline: true,
        tag: 'info:button',
      };
      info.addRowBelow = {
        label: 'Insert row below',
        value: {
          buttonLabel: 'Add',
          disabled: false,
        },
        inline: true,
        tag: 'info:button',
      };
      info.deleteRow = {
        label: 'Delete row',
        value: {
          buttonLabel: 'Delete',
          disabled: false,
        },
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
  }
  return { info, value, ...props };
};
