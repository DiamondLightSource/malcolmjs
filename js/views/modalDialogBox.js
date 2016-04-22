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
    border                     : '3px solid #ccc',
    background                 : '#3e3e3e',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '8px',
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

      /* Trying HTML tables to display content */

      var tableContent = [];

      for(var attribute in allBlockAttributes[blockName][attributeName]){
        if(typeof allBlockAttributes[blockName][attributeName][attribute]
          === 'string' ||
          typeof allBlockAttributes[blockName][attributeName][attribute]
          === 'number') {
          tableContent.push(
            <tr style={{verticalAlign: 'middle'}} >
              <td style={{width: '100px'}} >{attribute}</td>
              <td style={{width: '250px'}} >
                {allBlockAttributes[blockName][attributeName][attribute]}
              </td>
            </tr>
          )
        }
        /* A pretty bad way to do this, but I can't think
        of a better way at the moment
         */
        else if(attribute === 'type'){
          tableContent.push(
            <tr style={{verticalAlign: 'middle'}} >
              <td style={{width: '100px'}} >{attribute}</td>
              <td style={{width: '250px'}} >
                {allBlockAttributes[blockName][attributeName][attribute].name}
              </td>
            </tr>
          )
        }
        else if(attribute === 'alarm'){
          tableContent.push(
            <tr style={{verticalAlign: 'middle'}} >
              <td style={{width: '100px'}} >{attribute}</td>
              <td style={{width: '250px'}} >
                {allBlockAttributes[blockName][attributeName][attribute].severity}
              </td>
            </tr>
          )
        }
        else if(attribute === 'timeStamp'){
          tableContent.push(
            <tr style={{verticalAlign: 'middle'}} >
              <td style={{width: '100px'}} >{attribute}</td>
              <td style={{width: '250px'}} >
                {allBlockAttributes[blockName][attributeName][attribute].secondsPastEpoch}
              </td>
            </tr>
          )
        }
      }

      /* Add the error message if this.props.modalDialogBoxInfo.message isn't null */

      if(this.props.modalDialogBoxInfo.message !== null){
          tableContent.push(
            <tr style={{verticalAlign: 'middle'}} >
              <td style={{width: '100px'}} >Return</td>
              <td style={{width: '250px'}} >
                {this.props.modalDialogBoxInfo.message}
              </td>
            </tr>
        )
      }

      modalDialogBoxContent.push(
        <table id={blockName + attributeName + 'modalDialogBox'}
               style={{width: '370px', tableLayout: 'fixed'}} >
          <tbody>
          {tableContent}
          </tbody>
        </table>
      );


      /* Add the buttons */
      /* Only want a 'revert' button if there's an error I think? */

      var buttonRowContent = [];

      buttonRowContent.push(
        <td style={{width: '130px'}} >
          <button style={{marginTop: '0px'}}
                  onClick={this.closeModalDialogBox} >
            Cancel
          </button>
        </td>
      );

      if(this.props.modalDialogBoxInfo.message !== null){
        /* Add a revert button too */

        buttonRowContent.push(
          <td style={{width: '130px', textAlign: 'right'}} >
            <button style={{marginTop: '0px'}} >
              Revert
            </button>
          </td>
        );

      }

      var buttonTableContent =
        <table id={blockName + attributeName + 'modalDialogBoxButtons'}
               style={{width: '355px', tableLayout: 'fixed'}} >
          <tbody>
            <tr style={{verticalAlign: 'baseline'}} >
              {buttonRowContent}
            </tr>
          </tbody>
        </table>;

      modalDialogBoxContent.push(
        buttonTableContent
      )

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
