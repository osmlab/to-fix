import React, { PropTypes } from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import TasksSelectors from '../../stores/tasks_selectors';
import UserSelectors from '../../stores/user_selectors';
import SettingsSelectors from '../../stores/settings_selectors';
import ItemsSelectors from '../../stores/items_selectors';
import ItemsActionCreators from '../../stores/items_action_creators';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  user: UserSelectors.getUsername(state),
  isAuthenticated: UserSelectors.getIsAuthenticated(state),
  editor: SettingsSelectors.getEditorSetting(state),
  currentItemId: ItemsSelectors.getCurrentItemId(state),
});

const mapDispatchToProps = {
  updateItem: ItemsActionCreators.updateItem,
};

let EditBar = React.createClass({
  propTypes: {
    currentTaskId: PropTypes.string.isRequired,
    currentTask: PropTypes.object.isRequired,
    user: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    editor: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    updateItem: PropTypes.func.isRequired,
    onTaskEdit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  },

  mixins: [KeyBinding],

  keybindings: {
    'e': function(e) {
      if (this.props.isAuthenticated) this.edit()
    },
    's': function(e) {
      if (this.props.isAuthenticated) this.skip()
    },
    'f': function(e) {
      if (this.props.isAuthenticated) this.fixed()
    },
    'n': function(e) {
      if (this.props.isAuthenticated) this.noterror()
    },
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

  edit() { this.props.onTaskEdit() },
  skip() { this.updateItem('skip') },
  fixed() { this.updateItem('fixed') },
  noterror() { this.updateItem('noterror') },

  render() {
    const { currentTask, isAuthenticated, editor, geolocation, onUpdate, onTaskEdit } = this.props;

    const taskTitle = currentTask.value.name;
    let taskActions = (
      <nav className='tabs col12 clearfix'>
        <a onClick={onUpdate} className='col12 animate icon refresh'>Preview another task</a>
      </nav>
    );

    if (isAuthenticated) {
      const editorName = editor === 'josm' ? 'JOSM' : 'iD';

      taskActions = (
        <nav className='tabs col12 clearfix mobile-cols'>
          <button onClick={onTaskEdit} className='col3 button animate unround'>
            <span className='underline'>E</span>dit
            {` with ${editorName}`}
          </button>
          <button onClick={this.skip} className='col3 button animate'>
            <span className='underline'>S</span>kip
          </button>
          <button onClick={this.noterror} className='col3 button animate'>
            <span className='underline'>N</span>ot an error
          </button>
          <button onClick={this.fixed} className='col3 button animate'>
            <span className='underline'>F</span>ixed
          </button>
        </nav>
      );
    }

    return (
      <div className='editbar pin-bottomleft col6 pad4 z1 margin3'>
        <div className='round col12'>
          {taskActions}
          <div className='fill-lighten3 round-bottom col12 pad2x pad1y center strong inline truncate'>
            {taskTitle}
            {geolocation && <span className='quiet icon marker'>{geolocation}</span>}
          </div>
        </div>
      </div>
    );
  }
});

EditBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditBar);

export default EditBar;
