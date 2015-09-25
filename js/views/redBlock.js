/**
 * Created by twi18192 on 04/09/15.
 */

var React = require('react');

var RedBlockInfo = {
  name: "Red block",
  height: "100 pixels",
  width: "100 pixels",
  maxLength: "400 pixels",
  hello: function(){
    console.log("hello")
  }
};

var RedBlock = React.createClass({

  getRedBlockInfo: function(){
    return RedBlockInfo;
  },
  render: function(){
    return(
      <div/>
    )

  }

});

module.exports = RedBlock;
