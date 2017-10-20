/**
 * Created by twi18192 on 18/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import paneActions from '../actions/paneActions';
import attributeStore from '../stores/attributeStore';
import Modal from 'react-modal';

let modalDialogBoxStyling = {
  overlay: {
    height         : '100%',
    width          : '100%',
    position       : 'fixed',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    height                 : '300px',
    width                  : '400px',
    position               : 'absolute',
    top                    : '30%',
    left                   : '40%',
    right                  : 'auto',
    bottom                 : 'auto',
    border                 : '3px solid #ccc',
    background             : '#3e3e3e',
    overflow               : 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius           : '8px',
    outline                : 'none',
    padding                : '20px'

  }
};

function getModalDialogBoxState()
  {
  return {
    allBlockAttributes: attributeStore.getAllBlockAttributes()
  }
  }

export default class ModalDialogBox extends React.Component {
  constructor(props)
    {
    super(props);
    this.state = getModalDialogBoxState();
    this.__onChange = this.__onChange.bind(this);
    }


    __onChange()
      {
      this.setState(getModalDialogBoxState());
      }

    shouldComponentUpdate(nextProps, nextState)
      {
      return (
        nextProps.modalDialogBoxOpen === true ||
        nextProps.modalDialogBoxOpen !== this.props.modalDialogBoxOpen
      )
      }

    componentDidMount()
      {
      attributeStore.addChangeListener(this.__onChange);
      }

    componentWillUnmount()
      {
      attributeStore.removeChangeListener(this.__onChange);
      }

    closeModalDialogBox()
      {
      paneActions.closeModalDialogBox('this is the item');
      }

    createTableRow(blockName, attributeName, subAttributeName, attributeValue)
      {
      return (
        <tr key={blockName + attributeName + subAttributeName + 'tableRow'}
            style={{verticalAlign: 'middle'}}>
          <td key={blockName + attributeName + subAttributeName + 'titleColumn'}
              style={{width: '100px'}}>{subAttributeName}</td>
          <td key={blockName + attributeName + subAttributeName + 'valueColumn'}
              style={{width: '250px'}}>
            {attributeValue}
          </td>
        </tr>
      )
      }

    generateContent()
      {
      /* If the modalDialogBoxInfo is null, display
       something else?
       */

      let modalDialogBoxContent = [];
      let tableContent          = [];

      let blockName          = this.props.modalDialogBoxInfo.blockName;
      let attributeName      = this.props.modalDialogBoxInfo.attributeName;
      let allBlockAttributes = this.state.allBlockAttributes;

      if (blockName === null && attributeName === null)
        {
        modalDialogBoxContent.push(
          <p key={'modalDialogBoxNullText'} style={{color: 'lightgrey'}}>{"Null"}</p>
        )
        }
      else if (blockName !== null && attributeName !== null)
        {

        /* Trying HTML tables to display content */

        for (let attribute in allBlockAttributes[blockName][attributeName])
          {
          if (typeof allBlockAttributes[blockName][attributeName][attribute]
            === 'string' ||
            typeof allBlockAttributes[blockName][attributeName][attribute]
            === 'number')
            {
            tableContent.push(
              this.createTableRow(blockName, attributeName, attribute,
                allBlockAttributes[blockName][attributeName][attribute])
            )
            }
          /* A pretty bad way to do this, but I can't think
           of a better way at the moment
           */
          else if (attribute === 'type')
            {
            tableContent.push(
              this.createTableRow(blockName, attributeName, attribute,
                allBlockAttributes[blockName][attributeName][attribute].name)
            )
            }
          else if (attribute === 'alarm')
            {
            tableContent.push(
              this.createTableRow(blockName, attributeName, attribute,
                allBlockAttributes[blockName][attributeName][attribute].severity)
            )
            }
          else if (attribute === 'timeStamp')
            {
            tableContent.push(
              this.createTableRow(blockName, attributeName, attribute,
                allBlockAttributes[blockName][attributeName][attribute].secondsPastEpoch)
            )
            }
          }

        /* Add the error message if this.props.modalDialogBoxInfo.message isn't null */

        if (this.props.modalDialogBoxInfo.message !== null)
          {
          tableContent.push(
            this.createTableRow(this.props.modalDialogBoxInfo.blockName,
              this.props.modalDialogBoxInfo.attributeName, 'Return',
              this.props.modalDialogBoxInfo.message)
          )
          }

        modalDialogBoxContent.push(
          <table id={blockName + attributeName + 'modalDialogBoxTable'}
                 key={blockName + attributeName + 'modalDialogBoxTable'}
                 style={{width: '370px', tableLayout: 'fixed'}}>
            <tbody key={blockName + attributeName + 'modalDialogBoxTableBody'}>
            {tableContent}
            </tbody>
          </table>
        );


        /* Add the buttons */
        /* Only want a 'revert' button if there's an error I think? */

        let buttonRowContent = [];

        buttonRowContent.push(
          <td style={{width: '130px'}}
              key={'modalDialogBoxCloseButtonColumn'}>
            <button key={'modalDialogBoxCloseButton'}
                    style={{marginTop: '0px'}}
                    onClick={this.closeModalDialogBox}>
              {"Cancel"}
            </button>
          </td>
        );

        if (this.props.modalDialogBoxInfo.message !== null)
          {
          /* Add a revert button too */

          buttonRowContent.push(
            <td style={{width: '130px', textAlign: 'right'}}
                key={'modalDialogBoxRevertButtonColumn'}>
              <button key={'modalDialogBoxRevertButton'}
                      style={{marginTop: '0px'}}>
                {"Revert"}
              </button>
            </td>
          );

          }

        let buttonTableContent =
              <table id={blockName + attributeName + 'modalDialogBoxButtonsTable'}
                     key={blockName + attributeName + 'modalDialogBoxButtonsTable'}
                     style={{width: '355px', tableLayout: 'fixed'}}>
                <tbody key={blockName + attributeName + 'modalDialogBoxButtonsTableBody'}>
                <tr key={blockName + attributeName + 'modalDialogBoxButtonsTableRow'}
                    style={{verticalAlign: 'baseline'}}>
                  {buttonRowContent}
                </tr>
                </tbody>
              </table>;

        modalDialogBoxContent.push(
          buttonTableContent
        )

        }

      return modalDialogBoxContent;

      }

    render()
      {
      return (
        <Modal style={modalDialogBoxStyling}
                    isOpen={this.props.modalDialogBoxOpen}
                    contentLabel={"Diamond MalcolmJS Modal"}
                    onRequestClose={this.closeModalDialogBox}>
          {this.generateContent()}
        </Modal>
      )
      }

  }

ModalDialogBox.propTypes =
  {
  modalDialogBoxOpen: PropTypes.bool,
  modalDialogBoxInfo: PropTypes.object
  };

