/* eslint no-underscore-dangle: 0 */
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { sinkPort } from '../malcolm/malcolmConstants';
import {
  malcolmTypes,
  isArrayType,
} from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

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
          label: 'Type ID',
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
        label: 'Last Put Status',
        valuePath: 'calculated.errorMessage',
        inline: true,
        alarmStatePath: 'calculated.alarms.errorState',
      };
      if (props.clearError) {
        info.acknowledgeError = {
          showLabel: false,
          label: 'Acknowledge Error',
          value: 'Acknowledge Error',
          disabledPath: 'NOT.calculated.errorState',
          inline: true,
          tag: 'info:button',
          functions: {},
        };
      }
      if (
        attribute.raw.meta.tags.some(a =>
          ['widget:table', 'widget:textinput'].includes(a)
        )
      ) {
        info.localState = {
          label: 'Discard Local State',
          value: 'Discard Local State',
          showLabel: false,
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
        if (
          attribute.raw.meta.tags.some(a => a === 'widget:textinput') &&
          !isArrayType(attribute.raw.meta)
        ) {
          info.remoteState = {
            label: 'Remote state',
            value: attribute.raw.value,
            tag: 'widget:textupdate',
            inline: true,
          };
        }
      }
      ({ value } = attribute.raw);
    } else if (
      (attribute.raw.meta.typeid === malcolmTypes.table ||
        isArrayType(attribute.raw.meta)) &&
      attribute.localState
    ) {
      if (props.subElement[0] === 'row') {
        const row = parseInt(props.subElement[1], 10);
        const rowFlags = attribute.localState.flags.rows[row];
        const isNewRow = isArrayType(attribute.raw.meta)
          ? row >= attribute.raw.value.length
          : row >= attribute.raw.value[attribute.localState.labels[0]].length;
        info.localState = {
          label: 'Row local state',
          showLabel: false,
          value: 'Discard row local state',
          disabled: !(rowFlags._dirty || rowFlags._isChanged) || isNewRow,
          inline: true,
          tag: 'info:button',
          alarmState:
            rowFlags._dirty || rowFlags._isChanged ? AlarmStates.DIRTY : null,
        };
        const dataRow = {};
        if (!isArrayType(attribute.raw.meta)) {
          attribute.localState.labels.forEach(label => {
            dataRow[label] =
              row < attribute.raw.value[label].length
                ? attribute.raw.value[label][row]
                : 'undefined';
          });
        } else {
          dataRow.value =
            row < attribute.raw.value.length
              ? attribute.raw.value[row]
              : 'undefined';
        }
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
      } else {
        // column info will go here eventually
        info.columnHeading = {
          label: 'Column',
          value: props.subElement[1],
          inline: true,
        };
      }
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
          label: 'Type ID',
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
      if (Object.keys(attribute.raw.takes.elements).length > 0) {
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
        if (props.clearParamState) {
          info.takes.discardParams = {
            showLabel: false,
            label: 'Discard params',
            value: 'Discard params',
            tag: 'info:button',
            functions: {
              clickHandler: () => {
                Object.keys(attribute.raw.takes.elements).forEach(input => {
                  props.clearParamState(attribute.calculated.path, input);
                });
              },
            },
          };
        }
      }
      if (Object.keys(attribute.raw.returns.elements).length > 0) {
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
      }
      info.errorState = {
        label: 'Last Post Status',
        inline: true,
        value: attribute.calculated.errorMessage,
        alarmState: attribute.calculated.errorState
          ? AlarmStates.MAJOR_ALARM
          : null,
      };
      if (props.clearError) {
        info.acknowledgeError = {
          showLabel: false,
          label: 'Acknowledge Error',
          value: 'Acknowledge Error',
          disabledPath: 'NOT.calculated.errorState',
          inline: true,
          tag: 'info:button',
          functions: {},
        };
      }
    } else {
      info.parameterType = {
        label: 'Parameter Type',
        inline: true,
        value: props.subElement[0] === 'takes' ? 'Input' : 'Output',
      };
      info.typeid =
        attribute.raw[props.subElement[0]].elements[props.subElement[1]].typeid;
      info.description = {
        label: 'Description',
        inline: true,
        value:
          attribute.raw[props.subElement[0]].elements[props.subElement[1]]
            .description,
      };
      if (props.subElement[0] === 'takes') {
        info.required = {
          label: 'Required?',
          inline: true,
          value: attribute.raw.takes.required.includes(props.subElement[1]),
        };
        info.defaultValue = {
          label: 'Default Value',
          inline: true,
          value:
            attribute.raw.defaults[props.subElement[1]] !== undefined
              ? attribute.raw.defaults[props.subElement[1]]
              : 'undefined',
        };
        if (props.clearParamState) {
          info.discardParams = {
            showLabel: false,
            label: 'Discard param',
            value: 'Discard param',
            inline: true,
            tag: 'info:button',
            functions: {
              clickHandler: () => {
                props.clearParamState(
                  attribute.calculated.path,
                  props.subElement[1]
                );
              },
            },
          };
        }
      }
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
    .find(t => t.indexOf(sinkPort) > -1)
    .split(':')
    .slice(-1)[0];
  /*
  const layout = props.layoutAttribute.raw.value;
  const sourceIndex = -1;
  const sinkIndex = layout.mri.findIndex(a => a === blockMri);
  */
  const info = {
    sourcePort: {
      label: 'Source',
      valuePath: 'raw.value',
      inline: true,
      tag: portAttribute.raw.meta.choices ? 'widget:combo' : 'widget:textinput',
      choices: portAttribute.raw.meta.choices,
      disabled: props.isLayoutLocked || !portAttribute.raw.meta.writeable,
      functions: {
        eventHandler: (nullPath, value) =>
          props.eventHandler([blockMri, portName, 'value'], value),
        setFlag: () => {},
      },
    },
    sinkPort: {
      label: 'Sink',
      value: `${blockName}.${portName}`,
      inline: true,
    },
    /*
    showSource: {
      label: '',
      value: 'Show Source',
      inline: true,
      tag: 'info:button',
      showLabel: false,
      disabled:
        layout.visible[sourceIndex] ||
        props.isLayoutLocked ||
        portAttribute.raw.value === portNullValue,
      functions: {
        clickHandler: () => {
          if (sourceIndex !== -1) {
            props.eventHandler(props.layoutAttribute.calculated.path, {
              mri: [layout.mri[sourceIndex]],
              name: [layout.name[sourceIndex]],
              visible: [true],
              x: [layout.x[sinkIndex] - 180],
              y: [layout.y[sinkIndex]],
            });
          }
        },
      },
    },
    */
    deleteLink: {
      label: '',
      value: 'Delete',
      inline: true,
      tag: 'info:button',
      showLabel: false,
      disabled:
        props.isLayoutLocked ||
        !portAttribute.raw.meta.writeable ||
        portAttribute.raw.value === portNullValue,
      functions: {
        clickHandler: () => {
          props.eventHandler([blockMri, portName, 'value'], portNullValue);
          props.unselectLink([blockMri, portName]);
        },
      },
    },
  };

  return {
    info,
    value: {},
  };
};
