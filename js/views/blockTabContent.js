/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var Treeview = require('react-treeview');

var NonEditableReadoutField = require('./nonEditableReadoutField');
var TextEditableReadoutField = require('./textEditableReadoutField');
var DropdownEditableReadoutField = require('./dropdownEditableReadoutField');

var BlockTabContent = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      true
    )
  },

  render: function(){

    var blockAttributesDivs = [];

    for(var attribute in this.props.blockAttributes){

      var attributeLabel;
      var attributeDiv = [];

      if(this.props.blockAttributes[attribute].tags === undefined){
        /* Then it's a readonly readout,
        no methods or anything
         */

        attributeLabel =
          <NonEditableReadoutField blockAttribute={this.props.blockAttributes[this.props.blockName]}
                                   blockName={this.props.blockName}
                                   attributeName={attribute} />;

        /* Now need to push the appropriate content
         of a treeview element: ie, other readouts
         for methods, alarm status etc
         */

        for(var subAttribute in this.props.blockAttributes[attribute]){
          /* In a similar vain, need to check if it's
           just a readout, or there's another subtree!
           */

          if(typeof this.props.blockAttributes[attribute][subAttribute] === "string"){
            /* Just a readout, so no subtree needed */

            attributeDiv.push(
              <div style={{position: 'relative', left: '10', bottom: '0px', width: '230px', height: '25px'}}>
                <p key={this.props.blockName + attribute + subAttribute + "textContent"}
                   id={this.props.blockName + attribute + subAttribute + "textContent"}
                   style={{fontSize: '13px', position: 'relative', top: '0px', margin: '0px' }}>
                  {String(subAttribute)}
                </p>
                <div style={{position: 'relative', bottom: '18px', left: '64px'}}>
                  <button style={{position: 'relative', left: '215px',}}>Icon</button>
                  <input
                    style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                    value={String(this.props.blockAttributes[attribute][subAttribute])}
                    readOnly="readonly" maxLength="17" size="17"/>
                </div>
              </div>
            )
          }
          else{

            /* Need to create yet ANOTHER subtree for
             the attributes of the sub-attribute
             */

            attributeDiv.push(
              <div style={{position: 'relative', left: '10', bottom: '0px', width: '230px', height: '25px'}}>
                <p key={this.props.blockName + attribute + subAttribute + "textContent"}
                   id={this.props.blockName + attribute + subAttribute + "textContent"}
                   style={{fontSize: '13px', position: 'relative', top: '0px', margin: '0px'}}>
                  {String(subAttribute)}
                </p>
                <div style={{position: 'relative', bottom: '18px', left: '64px'}}>
                  <button style={{position: 'relative', left: '215px',}}>Icon</button>
                  <input
                    style={{position: 'relative', textAlign: 'left', borderRadius: '2px', border: '2px solid #999', color: 'green'}}
                    value={String(this.props.blockAttributes[attribute][subAttribute])}
                    readOnly="readonly" maxLength="17" size="17"/>
                </div>
              </div>
            )
          }

        }




      }
      else if(this.props.blockAttributes[attribute].tags !== undefined){
        /* Could be a readonly readout,
        or could be a editable method
        readout (text or dropdown)
         */

        /* I'm pretty sue this loop
        isn't doing what I want:
        for each tag, it's checking
        if it holds the string
        'method'; if it's a method,
        BUT the method tag isn't the
        first tag, then it'll be seen
        as NOT a method even though
        it is!
         */
        for(var k = 0; k < this.props.blockAttributes[attribute].tags.length; k++){
          if(this.props.blockAttributes[attribute].tags[k].indexOf('method') !== -1){
            /* Then the readout field is a
            method.

            Now need to check if it's a
            dropdown method, or a text
            editable method
             */

            if(this.props.blockAttributes[attribute].type.name === 'VEnum'){
              /* Use the dropdown editable
              readout field element
               */

              attributeLabel =
                <DropdownEditableReadoutField blockAttribute={this.props.blockAttributes[this.props.blockName]}
                                              blockName={this.props.blockName}
                                              attributeName={attribute} />

            }
            else{
              /* It's a text editable readout
              field
               */

              attributeLabel =
                <TextEditableReadoutField blockAttribute={this.props.blockAttributes[this.props.blockName]}
                                          blockName={this.props.blockName}
                                          attributeName={attribute} />

            }

          }
          else{
            /* Then the readout field is
            simply a readonly field
             */

            attributeLabel =
              <NonEditableReadoutField blockAttribute={this.props.blockAttributes[this.props.blockName]}
                                       blockName={this.props.blockName}
                                       attributeName={attribute} />

          }
        }

      }

      blockAttributesDivs.push(
        <Treeview key={this.props.blockName + this.props.attributeName + "treeview"}
                  nodeLabel={attributeLabel}
                  defaultCollapsed={true}
                  > {attributeDiv}
        </Treeview>
      )

    }

    return (
      blockAttributesDivs
    )
  }
});

module.exports = BlockTabContent;
