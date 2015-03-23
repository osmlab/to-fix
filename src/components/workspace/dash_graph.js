'use strict';

var React = require('react');
var Reflux = require('reflux');
var actions = require('../../actions/actions');
var d3Graph = require('../../util/d3Graph');

module.exports = React.createClass({
  mixins: [
    Reflux.listenTo(actions.sidebarToggled, 'resize')
  ],

  getGraphState: function() {
    return {
      data: this.props.data
    };
  },

  componentDidMount: function() {
    d3Graph.create(this.refs.brushgraph.getDOMNode());
  },

  componentDidUpdate: function() {
    d3Graph.update(this.refs.brushgraph.getDOMNode(), this.getGraphState());
  },

  componentWillUnmount: function() {
    d3Graph.destroy(this.refs.brushgraph.getDOMNode());
  },

  resize: function() {
    window.setTimeout(function() {
      d3Graph.resize(this.refs.brushgraph.getDOMNode());
    }.bind(this), 300);
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <div className='fill-darken1 pad2 round col12'>
        <div ref='brushgraph'></div>
      </div>
      /* jshint ignore:end */
    );
  }
});
