import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import filesize from 'file-size';

import { AsyncStatus } from '../../stores/async_action';
import UserSelectors from '../../stores/user_selectors';
import ModalsSelectors from '../../stores/modals_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';
import TasksActionCreators from '../../stores/tasks_action_creators';

const mapStateToProps = (state) => ({
  token: UserSelectors.getToken(state),
  showCreateTaskModal: ModalsSelectors.getShowCreateTaskModal(state),
});

const mapDispatchToProps = {
  closeCreateTaskModal: ModalsActionCreators.closeCreateTaskModal,
  createTask: TasksActionCreators.createTask,
};

class CreateTaskModal extends Component {
  initialState = {
    name: '',
    description: '',
    changesetComment: '',
    file: {},
    isLoading: false,
    isSuccess: false,
    isFailure: false,
    errorMessage: '',
  }

  state = this.initialState

  resetFormState = () => {
    this.setState({
      name: '',
      description: '',
      changesetComment: '',
      file: {},
    });
  }

  resetAsyncState = () => {
    this.setState({
      isLoading: false,
      isSuccess: false,
      isFailure: false,
      errorMessage: '',
    });
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

    const { createTask, token } = this.props;
    const formData = this.getFormData();

    this.resetAsyncState();
    this.setState({ isLoading: true });

    createTask({ token, payload: formData })
      .then(response => {
        this.setState({ isLoading: false });

        if (response.status === AsyncStatus.SUCCESS) {
          this.resetFormState();
          this.setState({
            isSuccess: true,
          });
        } else {
          this.setState({
            isFailure: true,
            errorMessage: response.error,
          });
        }
      });
  }

  getFormData = () => {
    const { name, description, changesetComment, file } = this.state;

    const formData = new window.FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('changesetComment', changesetComment);
    formData.append('file', file);

    return formData;
  }

  stopProp = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  renderNotice = () => {
    const { isSuccess, isFailure, errorMessage } = this.state;

    if (isSuccess) {
      return (
        <div className='pad2 note contain'>
          <h3>Success</h3>
          <p>Task created successfully.</p>
        </div>
      );
    }

    if (isFailure) {
      return (
        <div className='pad2 note error contain truncate'>
          <h3>Error</h3>
          <p>{errorMessage || 'Something went wrong.'}</p>
        </div>
      );
    }

    return null;
  }

  renderForm = () => {
    const { name, description, changesetComment, file } = this.state;

    return (
      <form className='pad2 space-bottom2 dark' onSubmit={this.handleSubmit}>
        <fieldset className='pad2x'>
          <label>Task name</label>
          <input
            type='text'
            className='col12 block clean'
            placeholder='Task name'
            value={name}
            required
            onChange={this.handleNameChange} />
        </fieldset>
        <fieldset className='pad2x'>
          <label>Description</label>
          <textarea
            type='text'
            className='col12 block clean resize'
            placeholder='Task description'
            value={description}
            required
            onChange={this.handleDescriptionChange} />
        </fieldset>
        <fieldset className='pad2x'>
          <label>Changeset comment</label>
          <textarea
            type='text'
            className='col12 block clean resize'
            placeholder='Changeset comment for this task'
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
        <div className='pad2x pad1y round-bottom col12 clearfix'>
          <input
            type='submit'
            className='col6 margin3 button quiet'
            value='Create task' />
        </div>
      </form>
    );
  }

  render() {
    const { showCreateTaskModal, closeCreateTaskModal } = this.props;

    const notice = this.renderNotice();
    const form = this.renderForm();

    if (showCreateTaskModal) {
      const loadingClass = this.state.isLoading ? 'loading' : '';
      const modalClass = `animate modal modal-content active ${loadingClass}`;

      return (
        <div className={modalClass} onClick={closeCreateTaskModal}>
          <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
            <button onClick={closeCreateTaskModal} className='unround pad1 icon fr close button quiet'></button>
            <div className='pad2'>
              <h2 className='dark'>Create a new task</h2>
            </div>
            {notice}
            {form}
          </div>
        </div>
      );
    }

    return null;
  }
}

CreateTaskModal.propTypes = {
  token: PropTypes.string.isRequired,
  showCreateTaskModal: PropTypes.bool.isRequired,
  closeCreateTaskModal: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
};

CreateTaskModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTaskModal);

export default CreateTaskModal;
