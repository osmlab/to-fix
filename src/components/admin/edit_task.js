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
      //status: if a task is complete
      //loading: to show the load gif when a task in on upload progress
      //startupload:when a task start to upload at server
      //successful_upload : if a task was successes upload
      confirm: {
        status: false,
        taskid: null,
        loading: false,
        startupload: false,
        successful_upload:false
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
    var changeset_comment = this.refs.taskchangeset_comment.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var file = this.refs.fileInput.getDOMNode();
    file = file.files[0];
    var random = this.refs.random.getDOMNode().checked;

    formData.append('id', this.state.task.id);
    formData.append('name', this.state.task.title);
    formData.append('source', source);
    formData.append('description', description);
    formData.append('changeset_comment', changeset_comment);    
    formData.append('password', password);
    formData.append('file', file);
    formData.append('random', random);
    formData.append('newtask', false);// newtask =true
    //start upload 
    this.setState({
      loading: true
    });
    //send the request
    xhr({
      uri: config.taskServer + 'csv',
      body: formData,
      method: 'POST'
    }, function(err, res) {
      if (err || res.statusCode === 400) {
        self.setState({
          startupload: true,
          status: false,
          loading: false
        });
        self.cleanup();
      } else {
        var resut = JSON.parse(res.body);

        if(resut.taskid !== undefined){
          self.setState({
            startupload: true,
            status: true,
            taskid: resut.taskid,
            successful_upload:true
          });
        }else{
          self.setState({
            startupload: true,
            status: true,
            loading: false
          });
        }
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
    }, 2000);
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
        var loading = (this.state.loading) ? 'dark loading' : 'dark';

        form = (
                <form className={loading} onSubmit={this.uploadData}>
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
                    <label>Changeset comment</label>
                    <textarea className='col12 block clean resize' ref='taskchangeset_comment' type='text' name='changeset_comment' defaultValue={this.state.task.changeset_comment} ></textarea>
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
        form = (<h2>Cannot update this task before complete.</h2>);
      }
    }
    return (
        /* jshint ignore:start */
        <div>{(this.state.startupload) ? ((this.state.successful_upload)?(<h2 className='dark'>Successful upload</h2>):(<h2 className='dark'>Something went wrong, try again</h2>)): form}</div>
        /* jshint ignore:end */
    );
  }
});
