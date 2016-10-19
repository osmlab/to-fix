import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router';

import actions from '../../actions/actions';
import UserStore from '../../stores/user_store';
import Keys from 'react-keybinding';
import taskObj from '../../mixins/taskobj';

const EditBar = React.createClass({
  mixins: [
    Reflux.connect(UserStore, 'user'),
    Reflux.listenTo(actions.geolocated, 'geolocate'),
    Keys
  ],

  keybindings: {
    'e': function() {
      this.edit();
    },
    's': function() {
      this.skip();
    },
    'f': function() {
      this.fixed();
    },
    'n': function() {
      this.noterror();
    }
  },

  edit: function() {
    actions.taskEdit(this.props.params.task);
  },

  noterror: function() {
    actions.taskNotError(this.props.params.task);
  },

  skip: function() {
    var task = this.props.params.task;
    actions.taskData(task);
    actions.taskSkip(task);
  },

  fixed: function() {
    actions.taskDone(this.props.params.task);
  },

  geolocate: function(placename) {
    this.setState({
      placename: placename
    });
  },

  render: function() {
    var taskTitle = taskObj(this.props.params.task).title;
    var taskActions = (
      <nav className='tabs col12 clearfix'>
        <a onClick={this.skip} className='col12 animate icon refresh'>Preview another task</a>
      </nav>
    );

    if (this.state.user && this.state.user.auth) {
      taskActions = (
        <nav className='tabs col12 clearfix mobile-cols'>
          <button onClick={this.edit} className='col3 button animate unround'>Edit</button>
          <button onClick={this.skip} className='col3 button animate'>Skip</button>
          <button onClick={this.noterror} className='col3 button animate'>Not an error</button>
          <button onClick={this.fixed} className='col3 button animate'>Fixed</button>
        </nav>
      );
    }

    return (
      <div className='editbar pin-bottomleft col12 pad4 z1'>
        <div className='round col6 margin3'>
          {taskActions}
          <div className='fill-lighten3 round-bottom col12 pad2x pad1y center strong inline truncate'>
            {taskTitle} {this.state.placename ? <span className='quiet icon marker'>{this.state.placename}</span> : ''}
          </div>
        </div>
      </div>
    );
  }
});

export default withRouter(EditBar);
