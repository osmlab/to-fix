'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var d3 = require('d3');
var actions = require('../actions/actions');
var taskObj = require('../mixins/taskobj');

module.exports = React.createClass({
  mixins: [
    Router.State,
    Reflux.listenTo(actions.sidebarToggled, 'resize'),
    taskObj
  ],

  statics: {
    fetchData: function(params) {
      actions.taskStats(params.task);
    }
  },

  componentDidMount: function() {

    // Populate the progress bar in this container
    var progress = this.refs.progress.getDOMNode();

    // Initialize the brush graph
    var brushGraph = d3.select(this.refs.brushgraph.getDOMNode());
    var margin = { top: 10, right: 10, bottom: 40, left: 40 },
        width = (parseInt(brushGraph.style('width'), 10)) - margin.left - margin.right,
        height = 120 - margin.top - margin.bottom;

    var parseDate = d3.time.format('%b %Y').parse;

    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');

    var brush = d3.svg.brush()
        .x(x)
        .on('brush', brushed);

    var area = d3.svg.area()
        .interpolate('monotone')
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.price); });

    var svg = brushGraph.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var context = svg.append('g')
        .attr('class', 'context')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    /*
    d3.csv('data.csv', type, function(err, data) {
      if (err) return console.warn(err);

      x.domain(d3.extent(data.map(function(d) { return d.date; })));
      y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
      context.append('path')
          .datum(data)
          .attr('class', 'area')
          .attr('d', area);

      context.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

      context.append('g')
          .attr('class', 'x brush')
          .call(brush)
        .selectAll('rect')
          .attr('y', -6)
          .attr('height', height + 7);
    });
    */

    function brushed() {
      // Returns an array of dates to do something with here.
      console.log(brush.extent());
    }

    function type(d) {
      // Accessor method as the data comes in.
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    }
  },

  resize: function() {
    // TODO Resize the d3 graph
    console.log('Resize the graph');
  },

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;

    return (
      /* jshint ignore:start */
      <div className='col10 pad2 dark'>
        <div className='space-bottom2 col12 clearfix'>
          <div className='col8'>
            <h4 className='quiet'>{taskTitle}</h4>
            <h1>Date goes here</h1>
          </div>
          <div className='col4'>
            <h4 className='quiet blockkk space-bottom1'>Completion total + left</h4>
            <div className='progress-bar clip contain fill-darken1 col12'>
              <div ref='progress' className='progress fill-darkgreen pin-left block col12'></div>
            </div>
          </div>
        </div>
        <div ref='brushgraph' className='fill-darken1 pad2 round'></div>
      </div>
      /* jshint ignore:end */
    );
  }
});
