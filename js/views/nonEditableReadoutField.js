/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var NonEditableReadoutField = React.createClass({

  render: function(){

    return(
      <div style={{position: 'relative', left: '5',
                   bottom: '0px', width: '230px', height: '25px'}}>
        <p key={this.props.blockName + this.props.attributeName + "textContent"}
           id={this.props.blockName + this.props.attributeName + "textContent"}
           style={{fontSize: '13px', position: 'relative'}}>
          {String(this.props.attributeName)}
        </p>
        <div style={{position: 'relative', bottom: '35px', left: '140px'}}>
          <button style={{position: 'relative', left: '165px',}}>Icon</button>
          <div style={{position: 'relative', backgroundColor: 'black', borderRadius: '2px',
          bottom: '23px', height: '23px', width: '162px'}} >
            <b style={{color: 'cyan', paddingLeft: '4px', paddingTop: '3px'}} >
              {String(this.props.blockAttribute.value)}
            </b>
          </div>
        </div>
      </div>
    )
  }

});

module.exports = NonEditableReadoutField;

//<input
//  style={{position: 'relative', textAlign: 'left', borderRadius: '2px',
//                    border: '2px solid #999', color: 'green'}}
//  value={String(this.props.blockAttribute.value)}
//  readOnly="readonly" maxLength="17" size="17"/>
