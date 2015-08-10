'use strict';

var React = require('react');
var Reflux = require('reflux');
var xhr = require('xhr');

var actions = require('../../actions/actions');
var Admin_store = require('../../stores/admin_store');
var config = require('../../config');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(Admin_store, 'task')
  ],

  statics: {
    fetchData: function(params) {
      actions.getTasks(params.task);
    }
  },

  getInitialState: function() {
    return {
      confirm: {
        status: false,
        taskid: null
      },
      selected: false
    };
  },

  triggerFileInput: function() {
    this.refs.fileInput.getDOMNode().click();
  },

  uploadData: function(e) {
    e.preventDefault();
    var self = this;
    // TODO sanitize/validation
    var formData = new window.FormData();
    var source = this.refs.tasksource.getDOMNode().value.trim();
    var description = this.refs.taskdescription.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var file = this.refs.fileInput.getDOMNode();
    file = file.files[0];
    var random = this.refs.random.getDOMNode().checked;

    formData.append('id', this.state.task.id);
    formData.append('name', this.state.task.title);
    formData.append('source', source);
    formData.append('owner', "node");//nome for now,will remove for next version on server
    formData.append('description', description);
    formData.append('password', password);
    formData.append('file', file);
    formData.append('random', random);
    formData.append('newtask', false);// newtask =true

    xhr({
      uri: config.taskServer + 'csv',
      body: formData,
      method: 'POST'
    }, function(err, res) {
      if (err || res.statusCode === 400) {
        self.setState({
          startupload: true,
          status: false
        });
        self.cleanup();
      } else {
        var resut = JSON.parse(res.body);
        self.setState({
          startupload: true,
          status: true,
          taskid: resut.taskid
        });
        self.cleanup();
      }
    });
  },

  cleanup: function() {
    var self = this;
    if (this.state.taskid !== null && typeof this.state.taskid !== "undefined") {
      window.location.href = '#/task/' + this.state.taskid;
      window.location.reload();
    }
    setTimeout(function() {
      self.setState({
        startupload: false,
        status: false
      });
    }, 3000);
  },

  triggerRandom: function() {
    this.refs.random.getDOMNode().checked ? this.setState({
      selected: false
    }) : this.setState({
      selected: true
    });
  },

  render: function() {
    var task = this.state.task;
    var form = '';
    if(typeof task !== 'undefined') {
      if(task.status) {
        form = (
                <form className='dark' onSubmit={this.uploadData}>
                  <fieldset className='pad2x'>
                    <label>Task name</label>
                    <input className='col12 block clean' ref='taskname' type='text' name='name' disabled="disabled" value={task.title} />
                  </fieldset>
                  <fieldset className='pad2x'>
                    <label>source</label>
                    <input className='col12 block clean' ref='tasksource' type='text' name='source' defaultValue={this.state.task.source} />
                  </fieldset>
                  <fieldset className='pad2x'>
                    <label>Description</label>
                    <textarea className='col12 block clean resize' ref='taskdescription' type='text' name='description' defaultValue={this.state.task.description} ></textarea>
                  </fieldset>
                  <fieldset className='pad2x'>
                    <label>Password</label>
                    <input className='col12 block clean' ref='password' type='password' name='uploadPassword' placeholder='Password' />
                  </fieldset>
                  <fieldset className='pad2x'>
                    <input type='file' className='hidden' ref='fileInput' name='uploadfile' accept=".csv"/>
                    <a onClick={this.triggerFileInput} className='button pad2x quiet'>Choose CSV</a>
                  </fieldset>
                  <div className='pad2 checkbox-pill'>
                    <input type='checkbox' id='random' ref='random' checked={this.state.selected}/>
                    <a onClick={this.triggerRandom} for='random' className='button icon check quiet'>Do not load randomize the data</a>
                  </div>
                  <div className='pad2x pad1y  round-bottom col12 clearfix'>
                    <input className='col6 margin3 button' type='submit' value='Update Task' />
                  </div>
                </form>
        );
      }else {
        form = (<h2>Can not update before finish this task...</h2>);
      }
    }
    return (
        /* jshint ignore:start */
        <div>{form}</div>
        /* jshint ignore:end */
    );
  }
});
