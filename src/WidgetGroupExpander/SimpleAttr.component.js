import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { Warning, Error, InfoOutline } from '@material-ui/icons';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  textName: {
    alignSelf: 'Center',
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  symbol: {
    color: theme.palette.primary.light,
    alignSelf: 'Center',
    'justify-content': 'end',
  },
});

const SimpleAttr = props => (
  <div className={props.classes.div}>
    <Typography className={props.classes.textName}>{props.name}: </Typography>
    {props.children}
    {props.alarm === 0 ? (
      <InfoOutline className={props.classes.symbol} />
    ) : null}
    {props.alarm === 1 ? <Warning className={props.classes.symbol} /> : null}
    {props.alarm === 2 ? <Error className={props.classes.symbol} /> : null}
  </div>
);

SimpleAttr.propTypes = {
  alarm: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    symbol: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(SimpleAttr);
