import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import filesize from 'file-size';

import { AsyncStatus } from '../../stores/async_action';
import UserSelectors from '../../stores/user_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';

const mapStateToProps = (state) => ({
  token: UserSelectors.getToken(state),
});

const mapDispatchToProps = {
  openSuccessModal: ModalsActionCreators.openSuccessModal,
};

class EditTask extends Component {
  state = {
    name: '',
    description: '',
    changesetComment: '',
    file: {},
  }

  handleNameChange = (e) => {
    const name = e.target.value;
    this.setState({ name });
  }

  handleDescriptionChange = (e) => {
    const description = e.target.value;
    this.setState({ description });
  }

  handleChangesetCommentChange = (e) => {
    const changesetComment = e.target.value;
    this.setState({ changesetComment });
  }

  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    this.setState({ file });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { onSubmit, token } = this.props;
    const formData = this.getFormData();

    onSubmit({ token, payload: formData })
      .then(response => {
        if (response.status === AsyncStatus.SUCCESS) {
          this.props.openSuccessModal('Task updated succesfully');
        }
      });
  }

  getFormData = () => {
    const { task } = this.props;
    const { name, description, changesetComment, file } = this.state;

    const formData = new window.FormData();

    formData.append('idtask', task.idtask);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('changesetComment', changesetComment);
    formData.append('isCompleted', false);
    formData.append('file', file);

    return formData;
  }

  setInitialState = () => {
    const { task } = this.props;

    this.setState({
      name: task.value.name,
      description: task.value.description,
      changesetComment: task.value.changesetComment,
    });
  }

  componentDidMount() {
    this.setInitialState();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.task.idtask !== this.props.idtask
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.task.idtask !== this.props.task.idtask) {
      this.setInitialState();
    }
  }

  render() {
    const { name, description, changesetComment, file } = this.state;
    const { onCancel } = this.props;

    return (
      <form className='dark' onSubmit={this.handleSubmit}>
        <fieldset className='pad2x'>
          <label>Task name</label>
          <input
            className='col12 block clean'
            type='text'
            value={name}
            onChange={this.handleNameChange} />
        </fieldset>
        <fieldset className='pad2x'>
          <label>Description</label>
          <textarea
            type='text'
            className='col12 block clean resize'
            value={description}
            required
            onChange={this.handleDescriptionChange} />
        </fieldset>
        <fieldset className='pad2x'>
          <label>Changeset comment</label>
          <textarea
            type='text'
            className='col12 block clean resize'
            value={changesetComment}
            required
            onChange={this.handleChangesetCommentChange} />
        </fieldset>
        <fieldset className='pad2x'>
          <input
            type='file'
            className='hidden'
            ref='fileInput'
            accept='.geojson'
            value=''
            onChange={this.handleFileInputChange} />
          <a className='button pad2x quiet'
             onClick={() => this.refs.fileInput.click()}>
              Choose GeoJSON
          </a>
          {file.name && <span className='pad1x quiet'>{`${file.name} (${filesize(file.size).human()})`}</span>}
        </fieldset>
        <div className='pad2x pad4y col12 clearfix'>
          <input
            type='submit'
            className='col3 button'
            value='Update task' />
          <button className='col3 space-left0 button quiet' onClick={onCancel}>Cancel</button>
        </div>
      </form>
    );
  }
}

EditTask.propTypes = {
  task: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  openSuccessModal: PropTypes.func.isRequired,
};

EditTask = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTask);

export default EditTask;
