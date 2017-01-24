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

class AddTask extends Component {
  initialState = {
    name: '',
    description: '',
    changesetComment: '',
    file: {},
  }

  state = this.initialState

  resetState = () => {
    this.setState(this.initialState);
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

    const { onTaskAdd, token } = this.props;
    const formData = this.getFormData();

    onTaskAdd({ token, payload: formData })
      .then(response => {
        if (response.status === AsyncStatus.SUCCESS) {
          this.props.openSuccessModal('Task created succesfully');
          this.resetState();
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

  render() {
    const { name, description, changesetComment, file } = this.state;

    return (
      <form className='dark' onSubmit={this.handleSubmit}>
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
            className='col6 margin3 button'
            value='Create Task' />
        </div>
      </form>
    );
  }
}

AddTask.propTypes = {
  onTaskAdd: PropTypes.func.isRequired,
  openSuccessModal: PropTypes.func.isRequired,
};

AddTask = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTask);

export default AddTask;
