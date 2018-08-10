import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import JSONInput from 'react-json-editor-ajrm';
// import Typography from '@material-ui/core/Typography';
// import ButtonAction from '../buttonAction/buttonAction.component';

import blockUtils from '../../malcolm/blockUtils';
import { malcolmUpdateMethodInput } from '../../malcolm/actions/method.actions';

const MethodViewer = props => {
  const method = props.attribute;
  if (method && props.selectedParam) {
    const param =
      method.raw[props.selectedParam[0]].elements[props.selectedParam[1]];
    let ioType;
    if (props.selectedParam[0] === 'takes') {
      ioType = 'inputs';
    } else if (props.selectedParam[0] === 'returns') {
      ioType = 'outputs';
    }
    const currentParamValue = method.calculated[ioType]
      ? method.calculated[ioType][props.selectedParam[1]]
      : null;
    const widgetTag = param.tags.find(t => t.indexOf('widget:') !== -1);
    const transitionWithPanelStyle = {
      left: props.openParent ? 360 : 0,
      width: `calc(100% - ${(props.openChild ? 360 : 0) +
        (props.openParent ? 360 : 0)}px)`,
      // transition: 'width 1s, left 1s',
    };
    switch (widgetTag) {
      case 'widget:tree':
        return (
          <div className={props.classes.plainBackground}>
            <div
              className={props.classes.tableContainer}
              style={{ ...transitionWithPanelStyle, textAlign: 'left' }}
            >
              <JSONInput
                placeholder={currentParamValue}
                onChange={val => {
                  if (!val.error) {
                    props.updateInput(
                      method.calculated.path,
                      props.selectedParam[1],
                      val.jsObject
                    );
                  }
                }}
                id={props.selectedParam}
                height="100%"
                width="100%"
                style={{ body: { fontSize: '150%' } }}
              />
            </div>
          </div>
        );
      default:
        return <div className={props.classes.plainBackground} />;
    }
  }

  return <div>oops!</div>;
};

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  /*
  let subElement;
  let selectedParam;
  const navLists = state.malcolm.navigation.navigationLists.slice(-3);
  const blockIndex = navLists.findIndex(nav => nav.navType === NavTypes.Block);
  const blockName =
    blockIndex !== -1 ? navLists[blockIndex].blockMri : undefined;
  const attributeName =
    navLists[blockIndex+1].navType === NavTypes.Attribute ? navLists[blockIndex+1].path : undefined;
  if (
    attribute.calculated.path[0] === blockName &&
    attribute.calculated.path[1] === attributeName
  ) {
    subElement =
      navLists[blockIndex+1].navType === NavTypes.Attribute && navLists[blockIndex+1].subElements
        ? navLists[blockIndex+1].subElements
        : undefined;
  }
  */
  const { subElement } = ownProps;
  return {
    attribute,
    selectedParam: subElement,
  };
};

const mapDispatchToProps = dispatch => ({
  updateInput: (path, inputName, inputValue) => {
    dispatch(malcolmUpdateMethodInput(path, inputName, inputValue));
  },
});

MethodViewer.propTypes = {
  // blockName: PropTypes.string.isRequired,
  // attributeName: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    localState: PropTypes.shape({
      value: PropTypes.shape({}),
      isDirty: PropTypes.bool,
      flags: PropTypes.shape({
        table: PropTypes.shape({
          selectedRow: PropTypes.number,
          dirty: PropTypes.bool,
          fresh: PropTypes.bool,
        }),
      }),
    }),
    calculated: PropTypes.shape({
      path: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    raw: PropTypes.shape({
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.string,
      }),
    }),
  }).isRequired,
  classes: PropTypes.shape({
    plainBackground: PropTypes.string,
    tableContainer: PropTypes.string,
  }).isRequired,
  selectedParam: PropTypes.arrayOf(PropTypes.string).isRequired,
  openParent: PropTypes.bool.isRequired,
  openChild: PropTypes.bool.isRequired,
  updateInput: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(MethodViewer)
);
