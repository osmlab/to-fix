import React, { Component, PropTypes } from 'react';

class AddTask extends Component {
  state = {
    isUploading: false,
    uploadSuccessful: false,
    error: null,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { onTaskAdd } = this.props;
    const formData = this.getFormData();

    this.setState({
      isUploading: true,
      uploadSuccessful: false,
      error: null,
    });

    onTaskAdd(formData).then(({ error }) => {
      if (error) {
        this.setState({ isUploading: false, error });
      } else {
        this.setState({ isUploading: false, uploadSuccessful: true });
      }
    });
  }

  getFormData = () => {
    const formData = new window.FormData();

    formData.append('name', this.refs.name.value.trim());
    formData.append('description', this.refs.description.value.trim());
    formData.append('changesetComment', this.refs.changesetComment.value.trim());
    formData.append('password', this.refs.password.value.trim());
    formData.append('file', this.refs.fileInput.files[0]);

    return formData;
  }

  renderNotice() {
    const { uploadSuccessful, error } = this.state;

    return (
      <div className='pad2x pad1y round-bottom col12 clearfix dark'>
        {uploadSuccessful
          ? <div className='note contain fill-lighten0'>
              <h3 className='dark'>The task has been added.</h3>
            </div>
          : null}
        {error
          ? <div className='note error contain'>
              <h3 className='dark'>Error: {error}.</h3>
            </div>
          : null}
      </div>
    );
  }

  renderForm() {
    const { isUploading } = this.state;

    return (
      <form className={isUploading ? 'dark loading' : 'dark'} onSubmit={this.handleSubmit}>
        <fieldset className='pad2x'>
          <label>Task name</label>
          <input className='col12 block clean' ref='name' type='text' placeholder='Task name' />
        </fieldset>
        <fieldset className='pad2x'>
          <label>Description</label>
          <textarea className='col12 block clean resize' ref='description' type='text' placeholder='Task description' ></textarea>
        </fieldset>
        <fieldset className='pad2x'>
          <label>Changeset comment</label>
          <textarea className='col12 block clean resize' ref='changesetComment' type='text' placeholder='Changeset comment for this task' ></textarea>
        </fieldset>
        <fieldset className='pad2x'>
          <label>Password</label>
          <input className='col12 block clean' ref='password' type='password' placeholder='Password' />
        </fieldset>
        <fieldset className='pad2x'>
          <input type='file' className='hidden' ref='fileInput' accept=".geojson" />
          <a onClick={() => this.refs.fileInput.click()} className='button pad2x quiet'>Choose GeoJSON</a>
        </fieldset>
        <div className='pad2x pad1y  round-bottom col12 clearfix'>
          <input className='col6 margin3 button' type='submit' value='Create Task' />
        </div>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderNotice()}
        {this.renderForm()}
      </div>
    );
  }
}

AddTask.propTypes = {
  onTaskAdd: PropTypes.func.isRequired,
};

export default AddTask;
