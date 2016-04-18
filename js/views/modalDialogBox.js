/**
 * Created by twi18192 on 18/04/16.
 */

var React = require('react');

var paneActions = require('../actions/paneActions');

var ReactModal = require('react-modal');

var modalDialogBoxStyling = {
  overlay : {
    height: '100%',
    width: '100%',
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)',
  },
  content : {
    height: '300px',
    width: '400px',
    position                   : 'absolute',
    top                        : '30%',
    left                       : '40%',
    right                      : 'auto',
    bottom                     : 'auto',
    border                     : '1px solid #ccc',
    background                 : '#3e3e3e',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '5px',
    outline                    : 'none',
    padding                    : '20px'

  }
};

var ModalDialogBox = React.createClass({

  closeModalDialogBox: function(){
    paneActions.closeModalDialogBox('this is the item');
  },

  generateContent: function(){
    /* If the modalDialogBoxInfo is null, display
    something else?
     */

    var modalDialogBoxContent = [];

    var blockName = this.props.modalDialogBoxInfo.blockName;
    var attributeName = this.props.modalDialogBoxInfo.attributeName;
    var allBlockAttributes = this.props.allBlockAttributes;

    if(blockName === null && attributeName === null){
      modalDialogBoxContent.push(
        <p style={{color: 'lightgrey'}} >Null</p>
      )
    }
    else if(blockName !== null && attributeName !== null){

      /* Info for the block lookup table widgets is in
      blockVisibleStore, so watch out that I'm assuming
      I'm only using widgets in block tabs for now
       */

      //for(var attribute in this.props.allBlockAttributes
      //  [this.props.modalDialogBoxInfo.blockName]
      //  [this.props.modalDialogBoxInfo.attributeName]){
      //  modalDialogBoxContent.push(
      //    <p style={{color: 'lightgrey'}} >
      //      {attribute}:
      //    </p>
      //  );
      //  if(typeof this.props.allBlockAttributes[this.props.modalDialogBoxInfo.blockName]
      //      [this.props.modalDialogBoxInfo.attributeName][attribute] === 'string') {
      //    modalDialogBoxContent.push(
      //      <p style={{color: 'lightgrey'}} >
      //        {this.props.allBlockAttributes[this.props.modalDialogBoxInfo.blockName]
      //          [this.props.modalDialogBoxInfo.attributeName][attribute]}
      //      </p>
      //    )
      //  }
      //}

      /* Trying HTML tables to display content */

      var tableContent = [];

      for(var attribute in allBlockAttributes[blockName][attributeName]){
        if(typeof allBlockAttributes[blockName][attributeName][attribute]
          === 'string' ||
          typeof allBlockAttributes[blockName][attributeName][attribute]
          === 'number') {
          tableContent.push(
            <tr>
              <td>{attribute}</td>
              <td>{allBlockAttributes[blockName][attributeName][attribute]}</td>
            </tr>
          )
        }
        /* A pretty bad way to do this, but I can't think
        of a better way at the moment
         */
        else if(attribute === 'type'){
          tableContent.push(
            <tr>
              <td>{attribute}</td>
              <td>{allBlockAttributes[blockName][attributeName][attribute].name}</td>
            </tr>
          )
        }
        else if(attribute === 'alarm'){
          tableContent.push(
            <tr>
              <td>{attribute}</td>
              <td>{allBlockAttributes[blockName][attributeName][attribute].severity}</td>
            </tr>
          )
        }
        else if(attribute === 'timeStamp'){
          tableContent.push(
            <tr>
              <td>{attribute}</td>
              <td>{allBlockAttributes[blockName][attributeName][attribute].secondsPastEpoch}</td>
            </tr>
          )
        }
      }

      /* Add the buttons */

      tableContent.push(
        <tr>
          <td verticalAlign="bottom" >
            <button style={{marginTop: '0px'}}
                  onClick={this.closeModalDialogBox} >
            Cancel
            </button>
          </td>
        </tr>
      );

      modalDialogBoxContent.push(
        <table id={blockName + attributeName + 'modalDialogBox'}
               style={{width: '100%'}} >
          <tbody>
          {tableContent}
          </tbody>
        </table>
      );

    }

    return modalDialogBoxContent;

  },

  render: function(){
    return(
      <ReactModal style={modalDialogBoxStyling}
                  isOpen={this.props.modalDialogBoxOpen}
                  onRequestClose={this.closeModalDialogBox} >
        {this.generateContent()}
      </ReactModal>
    )
  }

});

module.exports = ModalDialogBox;
