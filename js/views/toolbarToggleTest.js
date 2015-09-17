/**
 * Created by twi18192 on 28/08/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;

var MyPanel = React.createClass({

  getInitialState: function () {
    return {toolbars: true,
            footers: true};
  },

  handleToggleToolbars: function () {
    console.debug("IN handleToggleToolbars");
    this.setState({toolbars: !this.state.toolbars});
  },

  handleToggleFooters: function() {
    console.debug("IN handleToggleFooters");
    this.setState({footers: !this.state.footers})
  },

  render: function () {
    console.debug("IN RENDER 1, toolbars: " + this.state.toolbars + this.state.footers);
    return (
      <Panel theme="flexbox" useAvailableHeight={true} buttons={[
          <ToggleButton title="Toggle Toolbar" active={this.state.toolbars} onChange={this.handleToggleToolbars}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>,
          <ToggleButton title="Toggle Footer" active={this.state.footers} onChange={this.handleToggleFooters}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>
        ]}>
        <Tab title="One" icon="fa fa-plane" showToolbar={this.state.toolbars} showFooter={this.state.footers}>
          <Toolbar>Toolbar content of One</Toolbar>
          <Content>Content of One</Content>
          <Footer >Footer content of One</Footer>
        </Tab>
        <Tab title="Two" icon="fa fa-fire" showToolbar={this.state.toolbars}>
          <Content>Content of Two</Content>
        </Tab>
      </Panel>
    );
  }
});

React.render(<MyPanel />,document.getElementById('root'));
