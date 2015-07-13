'use strict';

var React = require('react');
var Reflux = require('reflux');

var actions = require('../../actions/actions');
var Admin_store = require('../../stores/admin_store');
var Addtask = require('./add_task');
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
    if(typeof task.task !== 'undefined'){
      var info = ( <div>
                  <div className='rows'>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Title</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.title}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Id Task</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.id}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Source</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.source}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Owner</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.owner}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Description</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.description}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Updated</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.updated}
                      </div>
                    </div>
                    <div className='clearfix fill-darken1 dark mobile-cols'>
                      <div className='fl strong pad1 fill-darken1 editor-key'>
                        <span className='capitalize'>Status</span>
                      </div>
                      <div className='pad1 fl space'>
                        {task.task.status}
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
