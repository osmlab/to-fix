import React from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { updateItem } from '../../actions';
import {
  getUsername,
  getEditorSetting,
  getCurrentTask,
  getCurrentItemId,
  getAuthenticated,
} from '../../reducers';

let EditBar = React.createClass({
  mixins: [KeyBinding],

  keybindings: {
    'e': function() { this.edit() },
    's': function() { this.skip() },
    'f': function() { this.fixed() },
    'n': function() { this.noterror() },
  },

  updateItem(action) {
    const { updateItem, user, editor, currentTaskId, currentItemId, onUpdate } = this.props;
    const payload = {
      user,
      editor,
      action,
      key: currentItemId,
    };
    updateItem({ idtask: currentTaskId, payload }).then(onUpdate);
  },

  edit() { this.props.onEditTask() },
  skip() { this.updateItem('skip') },
  fixed() { this.updateItem('fixed') },
  noterror() { this.updateItem('noterror') },

  render() {
    const { currentTask, authenticated, geolocation } = this.props;

    const taskTitle = currentTask.value.name;
    let taskActions = (
      <nav className='tabs col12 clearfix'>
        <a onClick={this.skip} className='col12 animate icon refresh'>Preview another task</a>
      </nav>
    );

    if (authenticated) {
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
            {taskTitle} {geolocation ? <span className='quiet icon marker'>{geolocation}</span> : ''}
          </div>
        </div>
      </div>
    );
  }
});
const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  currentTask: getCurrentTask(state, params.task),
  user: getUsername(state),
  editor: getEditorSetting(state),
  currentItemId: getCurrentItemId(state),
  authenticated: getAuthenticated(state),
});

EditBar = withRouter(connect(
  mapStateToProps,
  { updateItem },
)(EditBar));

export default EditBar;
