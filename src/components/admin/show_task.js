'use strict';

var React = require('react');
var Reflux = require('reflux');
var d3 = require('d3');

var actions = require('../../actions/actions');
var Admin_store = require('../../stores/admin_store');
module.exports = React.createClass({
  mixins: [
    Reflux.connect(Admin_store, 'task')
  ],
  statics: {
    fetchData: function(params) {
      actions.getTasks(params.task);
    }
  },
  render: function() {
    var task = this.state.task;
    var info = '';

    if (typeof task !== 'undefined') {
      var dateDisplay = d3.time.format('%B %-d');
      var timeDisplay = d3.time.format('%-I:%-M%p');
      var actionDay = dateDisplay(new Date(task.updated * 1000));
      var actionTime = timeDisplay(new Date(task.updated * 1000));
      var status = '';
      (task.status) ? status = 'Completed': status = 'Items remaining to be done';
      info = ( <div>
                  <div className='rows'>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Title</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.title}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Id Task</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.id}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Source</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.source}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Description</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.description}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Updated</span>
                      </div>
                      <div className='pad1 fl space'>
                      {actionDay}<span className='quiet'> {actionTime} </span>
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Status</span>
                      </div>
                      <div className='pad1 fl space'>
                      {status}
                      </div>
                    </div>
                  </div>
                </div>
      );
    }

    return (
        /* jshint ignore:start */
        <div>{info}</div>
        /* jshint ignore:end */
    );

  }
});
