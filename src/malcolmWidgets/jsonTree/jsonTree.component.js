/* eslint react/no-array-index-key: 0 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import locale from 'react-json-editor-ajrm/dist/locale/en';
import JSONInput from 'react-json-editor-ajrm';
import ButtonAction from '../buttonAction/buttonAction.component';
import blockUtils from '../../malcolm/blockUtils';

const JSONTree = props => {
  const path = [props.blockName, props.attributeName];
  if (props.attribute.localState === undefined) {
    props.copyObject(path);
  }

  const footerItems = [
    ...props.footerItems,
    props.attribute.localState && props.attribute.localState.flags.fresh ? (
      <Typography>Up to date!</Typography>
    ) : (
      <Typography>
        Update received @{' '}
        {new Date(
          props.attribute.raw.timeStamp.secondsPastEpoch * 1000
        ).toISOString()}
      </Typography>
    ),
    <ButtonAction
      clickAction={() => {
        props.revertHandler(path);
      }}
      text="Discard changes"
    />,
    <ButtonAction
      clickAction={() =>
        props.putObject(path, props.attribute.localState.value)
      }
      text="Submit"
    />,
  ];
  return (
    <div>
      <JSONInput
        locale={locale}
        placeholder={props.attribute.localState.value}
        id={`[${props.blockName}, ${props.attributeName}]`}
        height="100%"
        width="100%"
        style={{ body: { fontSize: '150%' } }}
      />
      <Table>
        <TableFooter>
          <TableRow style={{ height: '30px' }}>
            {footerItems.map((item, key) => (
              <TableCell key={key}>{item}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
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
  return { attribute };
};

const mapDispatchToProps = () => ({}); /* dispatch => ({

  revertHandler: path => {
    dispatch(malcolmRevertAction(path));
  },
  putObject: (path, value) => {
    dispatch(malcolmPutAction(path, value));
  },
}); */

JSONTree.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    localState: PropTypes.shape({
      value: PropTypes.shape({}),
      flags: PropTypes.shape({
        dirty: PropTypes.bool,
        fresh: PropTypes.bool,
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
  revertHandler: PropTypes.func.isRequired,
  copyObject: PropTypes.func.isRequired,
  putObject: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
  /* theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }).isRequired, */
};

JSONTree.defaultProps = {
  footerItems: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(JSONTree)
);
