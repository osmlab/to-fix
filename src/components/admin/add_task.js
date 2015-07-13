var React = require('react');
var _ = require('lodash');
var BannersStore = require('../../stores/admin_store');
 
var AddForm = React.createClass({
   getInitialState: function() {
    return {
      task: {
        id: Math.floor((Math.random() * 10000) + 1),
        name: '',
        imageUrl: 'http://yet-anothergif.com',
        targetUrl: 'http://www.topcoder.com',
        active: 'Yes'
      },
      errors: {}
    }
  },
  triggerFileInput: function() {
    this.refs.fileInput.getDOMNode().click();
  }, 
  triggerRandom: function() {
    this.refs.random.getDOMNode().checked ? this.setState({selected:false}) : this.setState({selected:true});
  }, 
  render: function() { 
    return (
  <form className='dark' onSubmit={this.uploadData}>
    <fieldset className='pad2x'>
      <label>Id Task</label>
      <input className='col12 block clean' ref='taskid' type='text' name='id' placeholder='Id will generate' />
    </fieldset>
    <fieldset className='pad2x'>
      <label>Task name</label>
      <input className='col12 block clean' ref='taskname' type='text' name='name' placeholder='Task name' />
    </fieldset>
    <fieldset className='pad2x'>
      <label>source</label>
      <input className='col12 block clean' ref='tasksource' type='text' name='source' placeholder='Task Source' />
    </fieldset>
    <fieldset className='pad2x'>
      <label>Owner</label>
      <input className='col12 block clean' ref='taskowner' type='text' name='owner' placeholder='Task owner' />
    </fieldset>
    <fieldset className='pad2x'>
      <label>Description</label>
      <textarea className='col12 block clean resize' ref='taskdescription' type='text' name='description' placeholder='Task description' ></textarea>
    </fieldset>
    <fieldset className='pad2x'>
      <label>Password</label>
      <input className='col12 block clean' ref='password' type='password' name='uploadPassword' placeholder='Password' />
    </fieldset>
    <fieldset className='pad2x'>
      <input type='file' className='hidden'  ref='fileInput' name='uploadfile' />
      <a onClick={this.triggerFileInput} className='button pad2x  quiet'>Choose CSV</a>
    </fieldset>
    <div className='pad2 checkbox-pill'>
      <input type='checkbox' id='random' ref='random'  checked={this.state.selected}/>
      <a onClick={this.triggerRandom} for='random' className='button icon check quiet'>Do not load randomize the data</a>      
    </div>
    <div className='pad2x pad1y  round-bottom col12 clearfix'>
      <input className='col6 margin3 button' type='submit' value='Create Task' />
    </div>
  </form>
    ); 
  } 
});
 module.exports = AddForm;
 
