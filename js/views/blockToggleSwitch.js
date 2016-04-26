/**
 * Created by twi18192 on 22/03/16.
 */

var React = require('react');

var ToggleSwitch = require('react-toggle');

var WidgetStatusIcon = require('./widgetStatusIcon');

var BlockToggleSwitch = React.createClass({
  render: function(){
    /* 'on' is the default setting of the switch, shall be
     from the server at some point (perhaps a ternary operator?)
     */
    return(

      <table id={this.props.blockName + this.props.attributeName + 'contentTable'}
             style={{width: '350px', tableLayout: 'fixed'}} >
        <tbody>
        <tr style={{verticalAlign: 'middle'}} >
          <td style={{width: this.props.isInAGroup === true ? '170px' : '180px'}} >
            <p style={{margin: '0px'}}>
              {String(this.props.attributeName)}
            </p>
          </td>
          <td style={{width: '150px'}} >
            <div style={{display: 'flex', alignItems: 'flex-start', left: '45'}} >
              <p style={{margin: '0px', width: '40px', position: 'relative'}} >Hide</p>
              <div id="testToggleSwitch" style={{height: '21', width: '50'}} >
                <ToggleSwitch onChange={this.props.toggleSwitch.bind(null, this.props.blockName,
                                this.props.attributeName, this.props.toggleOrientation)}
                            checked={this.props.toggleOrientation === 'Show' ||
                                     this.props.toggleOrientation === true}
                            defaultChecked={this.props.toggleOrientation === 'Show' ||
                                            this.props.toggleOrientation === true}
                            id={this.props.blockName + 'toggleSwitch'}
                            on={this.props.toggleOrientation === 'Show' ||
                                this.props.toggleOrientation === true} />
              </div>
              <p style={{margin: '0px', width: '40px'}} >Show</p>
            </div>
          </td>
          <td style={{width: '30px', textAlign: 'center'}} >
            <WidgetStatusIcon blockName={this.props.blockName}
                              attributeName={this.props.attributeName}
                              blockAttribute={this.props.blockAttribute}
                              blockAttributeStatus={this.props.blockAttributeStatus}/>
          </td>
        </tr>
        </tbody>
      </table>

    )
  }
});

module.exports = BlockToggleSwitch;
