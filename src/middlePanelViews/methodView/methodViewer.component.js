/* eslint react/no-array-index-key: 0 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import CircularBuffer from 'circular-buffer';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/dist/locale/en';
// below is for updated version of json editor
// import locale from 'react-json-editor-ajrm/locale/en';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

// import ButtonAction from '../buttonAction/buttonAction.component';
import WidgetTable from '../../malcolmWidgets/table/table.component';
import MethodArchive from './methodArchive.container';

import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmUpdateMethodInput,
  malcolmIntialiseMethodParam,
} from '../../malcolm/actions/method.actions';
import { isArrayType } from '../../malcolm/reducer/method.reducer';
import { getDefaultFromType } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

const noOp = () => {};

const MethodViewer = props => {
  if (props.method && props.selectedParam) {
    const widgetTag = props.selectedParamMeta.tags.find(
      t => t.indexOf('widget:') !== -1
    );
    // const { localStorage } = window;
    const footerItems = [
      ...props.footerItems /*
      <ButtonAction
        text="Save to cookie"
        clickAction={() => {
          localStorage.setItem(
            `${props.blockName},${props.attributeName}.${props.selectedParam}`,
            JSON.stringify(props.selectedParamValue)
          );
        }}
      />,
      <ButtonAction
        text="Load from cookie"
        clickAction={() => {
          const savedJSONString = localStorage.getItem(
            `${props.blockName},${props.attributeName}.${props.selectedParam}`
          );
          const savedVal = JSON.parse(savedJSONString);
          props.updateInput(
            props.method.calculated.path,
            props.selectedParam[1],
            savedVal
          );
        }}
      />, */,
    ];
    if (
      props.selectedParamValue !== undefined ||
      props.selectedParam[0] === 'takes'
    ) {
      switch (widgetTag) {
        case 'widget:tree':
          return (
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ height: 'calc(100% - 56px)' }}>
                <JSONInput
                  locale={locale}
                  placeholder={props.selectedParamValue}
                  viewOnly={!props.selectedParamMeta.writeable}
                  onChange={val => {
                    if (!val.error) {
                      props.updateInput(
                        props.method.calculated.path,
                        props.selectedParam[1],
                        val.jsObject
                      );
                    }
                  }}
                  id={props.selectedParam}
                  height="100%"
                  width="100%"
                  style={{ body: { fontSize: '100%' } }}
                />
              </div>
              <Table>
                <TableFooter>
                  <TableRow>
                    {footerItems.map((item, key) => (
                      <TableCell key={key}>{item}</TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          );
        case 'widget:textinput':
        case 'widget:textupdate':
        case 'widget:combobox':
        case 'widget:checkbox':
        case 'widget:led': {
          if (isArrayType(props.selectedParamMeta)) {
            if (props.selectedParamValue === undefined) {
              props.initialiseLocalState(
                props.method.calculated.path,
                props.selectedParam
              );
              return <div>Loading...</div>;
            } else if (
              props.selectedParam[0] === 'returns' ||
              (props.selectedParamValue.meta && props.selectedParamValue.value)
            ) {
              return (
                <WidgetTable
                  localState={
                    props.selectedParam[0] === 'returns'
                      ? {
                          value: props.selectedParamValue,
                          meta: props.selectedParamMeta,
                          flags: { rows: [] },
                        }
                      : props.selectedParamValue
                  }
                  attribute={props.method}
                  eventHandler={
                    props.selectedParam[0] === 'takes' &&
                    props.selectedParamMeta.writeable
                      ? (path, value, row) => {
                          const newValue = [...props.selectedParamValue.value];
                          newValue[row] = value;
                          props.updateInput(
                            path,
                            props.selectedParam[1],
                            newValue
                          );
                        }
                      : noOp
                  }
                  setFlag={() => {}}
                  addRow={() => {
                    props.updateInput(
                      props.method.calculated.path,
                      props.selectedParam[1],
                      [
                        ...props.selectedParamValue.value,
                        getDefaultFromType(props.selectedParamMeta),
                      ]
                    );
                  }}
                  infoClickHandler={noOp}
                  rowClickHandler={noOp}
                />
              );
            }
          }
          return (
            <MethodArchive
              methodArchive={props.methodArchive}
              openPanels={{ parent: props.openParent, child: props.openChild }}
              selectedParam={props.selectedParam}
              defaultTab={0}
            />
          );
        }
        default:
          return <div />;
      }
    } else {
      return <Typography>No results yet...run method first!</Typography>;
    }
  } else if (props.method && props.methodArchive) {
    const timeStamps = props.methodArchive.timeStamp.toarray();
    const values = props.methodArchive.value.toarray();
    const copyRunParams = row => {
      const params = values[row].runParameters;
      Object.keys(props.method.raw.takes.elements).forEach(paramName => {
        props.updateInput(
          props.method.calculated.path,
          paramName,
          params[paramName]
        );
      });
    };
    const dummyAttribute = {
      raw: {
        value: {
          postTime: timeStamps.map(stamp => stamp.localRunTime),
          returnTime: timeStamps.map(stamp => stamp.localReturnTime),
          returnStatus: values.map(value => value.returnStatus),
          alarm: props.methodArchive.alarmState.toarray(),
          copyParams: timeStamps.map(() => ({
            label: 'Copy',
            action: path => {
              copyRunParams(path.row);
            },
          })),
        },
        meta: {
          elements: {
            alarm: {
              tags: ['info:alarm'],
              label: 'Alarm state',
            },
            postTime: {
              tags: ['widget:textupdate'],
              label: 'Time run',
            },
            returnTime: {
              tags: ['widget:textupdate'],
              label: 'Time results received',
            },
            returnStatus: {
              tags: ['widget:textupdate'],
              label: 'Return Status',
            },
            copyParams: {
              tags: ['info:button'],
              label: 'Reuse run params',
              writeable: true,
            },
          },
        },
      },
      calculated: {},
    };
    return (
      <WidgetTable
        attribute={dummyAttribute}
        hideInfo
        eventHandler={noOp}
        setFlag={noOp}
        addRow={noOp}
        infoClickHandler={noOp}
        rowClickHandler={noOp}
      />
    );
  }

  return <div>oops!</div>;
};

const mapStateToProps = (state, ownProps) => {
  let methodIndex;
  let method;
  let methodArchive;
  let selectedParamMeta;
  let selectedParamValue;
  if (ownProps.attributeName && ownProps.blockName) {
    methodIndex = blockUtils.findAttributeIndex(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  let selectedParam = ownProps.subElement;
  if (methodIndex > -1) {
    method = state.malcolm.blocks[ownProps.blockName].attributes[methodIndex];
    methodArchive =
      state.malcolm.blockArchive[ownProps.blockName].attributes[methodIndex];
  }
  if (selectedParam && selectedParam[0] === undefined) {
    selectedParam = undefined;
  } else if (method && selectedParam && selectedParam[0]) {
    selectedParamMeta = method.raw[selectedParam[0]].elements[selectedParam[1]];
    let ioType;
    if (selectedParam[0] === 'takes') {
      ioType = 'inputs';
    } else if (selectedParam[0] === 'returns') {
      ioType = 'outputs';
    }
    selectedParamValue = method.calculated[ioType]
      ? method.calculated[ioType][selectedParam[1]]
      : null;
  }
  return {
    method,
    methodArchive,
    selectedParam,
    selectedParamMeta,
    selectedParamValue,
  };
};

const mapDispatchToProps = dispatch => ({
  updateInput: (path, inputName, inputValue) => {
    dispatch(malcolmUpdateMethodInput(path, inputName, inputValue));
  },
  initialiseLocalState: (path, selectedParam) => {
    dispatch(malcolmIntialiseMethodParam(path, selectedParam));
  },
});

MethodViewer.propTypes = {
  // blockName: PropTypes.string.isRequired,
  // attributeName: PropTypes.string.isRequired,
  method: PropTypes.shape({
    calculated: PropTypes.shape({
      path: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    raw: PropTypes.shape({
      takes: PropTypes.shape({
        elements: PropTypes.shape({}),
      }),
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.string,
      }),
    }),
  }).isRequired,
  methodArchive: PropTypes.shape({
    timeStamp: PropTypes.instanceOf(CircularBuffer),
    value: PropTypes.instanceOf(CircularBuffer),
    alarmState: PropTypes.instanceOf(CircularBuffer),
  }).isRequired,
  selectedParamMeta: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
    writeable: PropTypes.bool,
    typeid: PropTypes.string,
  }).isRequired,
  selectedParamValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
  selectedParam: PropTypes.arrayOf(PropTypes.string).isRequired,
  openParent: PropTypes.bool.isRequired,
  openChild: PropTypes.bool.isRequired,
  updateInput: PropTypes.func.isRequired,
  initialiseLocalState: PropTypes.func.isRequired,
};

MethodViewer.defaultProps = {
  footerItems: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(MethodViewer)
);
