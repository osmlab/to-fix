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
    description: '',
    changesetComment: '',
    file: {},
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

    const { onTaskEdit, token } = this.props;
    const formData = this.getFormData();
    const payload = { formData, token };

    onTaskEdit(payload)
      .then(response => {
        if (response.status === AsyncStatus.SUCCESS) {
          this.props.openSuccessModal('Task updated succesfully');
        }
      });
  }

  getFormData = () => {
    const { task } = this.props;
    const { description, changesetComment, file } = this.state;

    const formData = new window.FormData();

    formData.append('idtask', task.idtask);
    formData.append('name', task.value.name);
    formData.append('description', description);
    formData.append('changesetComment', changesetComment);
    formData.append('isCompleted', false);
    formData.append('file', file);

    return formData;
  }

  setInitialState = () => {
    const { task } = this.props;

    this.setState({
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
    const { task } = this.props;
    const { description, changesetComment, file } = this.state;

    // if (!task.isComplete) {
    //   return <h2>Cannot update this task before complete.</h2>;
    // }

    return (
      <form className='dark' onSubmit={this.handleSubmit}>
        <fieldset className='pad2x'>
          <label>Task name</label>
          <input
            className='col12 block clean'
            type='text'
            disabled='disabled'
            value={task.value.name} />
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
        <div className='pad2x pad1y round-bottom col12 clearfix'>
          <input
            type='submit'
            className='col6 margin3 button'
            value='Update Task' />
        </div>
      </form>
    );
  }
}

EditTask.propTypes = {
  task: PropTypes.object.isRequired,
  onTaskEdit: PropTypes.func.isRequired,
  openSuccessModal: PropTypes.func.isRequired,
};

EditTask = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTask);

export default EditTask;
