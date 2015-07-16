var React = require('react');
var admin_store = require('../../stores/admin_store');
var $ = require('jquery');
var actions = require('../../actions/actions');
var config = require('../../config');

var AddForm = React.createClass({
  getInitialState: function() {
    return {
      confirm: {
        status: false,
        taskname: null
      },
      selected:false,
      csvlines:[]
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
    var id = this.refs.taskid.getDOMNode().value.trim();
    var name = this.refs.taskname.getDOMNode().value.trim();
    var source = this.refs.tasksource.getDOMNode().value.trim();
    var owner = this.refs.taskowner.getDOMNode().value.trim();
    var description = this.refs.taskdescription.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var file = this.refs.fileInput.getDOMNode();
    file = file.files[0];
    var random = this.refs.random.getDOMNode().checked;

    formData.append('id', id);
    formData.append('name', name);
    formData.append('source', source);
    formData.append('owner', owner);
    formData.append('description', description);
    formData.append('password', password);
    formData.append('file', file);
    formData.append('random', random);

    $.ajax({
      url: config.taskServer + 'csv',
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data) {
        self.setState({
          startupload: true,
          status: true
        });
        self.cleanup();
      },
      error: function(xhr, status, err) {
        self.setState({
          startupload: true,
          status: false
        });
        self.cleanup();
      }
    });
  },
  handleFiles: function() {
        var reader = new FileReader();
        reader.onload = this.loadHandler;
        reader.onerror = this.errorHandler;
        reader.readAsText(this.refs.fileInput.getDOMNode().files[0]);
    },
    loadHandler: function(event) {
        var csv = event.target.result;
        console.log(csv.split("\n")[0]);
        var lines = [];
        lines.push(csv.split("\n")[0].split(","));
        lines.push(csv.split("\n")[1].split(","));
        this.setState({csvlines:lines});
    },
    errorHandler: function(event) {
        if (evt.target.error.name == "NotReadableError") {
           this.setState({csvheaders:"Canno't read file !"});
        }
    },

  cleanup: function() {
    var self = this;
    setTimeout(function() {
      self.setState({
        startupload: false,
        status: false,
        csvlines:[]
      });
    }, 3000);
  },

  triggerRandom: function() {
    this.refs.random.getDOMNode().checked ? this.setState({
      selected: false
    }) : this.setState({
      selected: true
    });
  },
  render: function() {
    var csvtable = '';
    if (this.state.csvlines.length > 0) {
      var table = this.state.csvlines.map(function(row, i) {
        var table_row = row.map(function(item, j) {
          return (<th> {item} </th>);
        });
        if (i === 0) {
          return (<thead><tr>{table_row}</tr></thead>);
        } else {
          return (<tbody><tr>{table_row}</tr></tbody>);
        }
      });
      csvtable = (<table className="prose">{table}</table>);
    }
    var form = (<form className='dark' onSubmit={this.uploadData}>
              <fieldset className='pad2x'>
                <label>Task name</label>
                <input className='col12 block clean' ref='taskname' type='text' name='name' placeholder='Task name' />
              </fieldset>
              <fieldset className='pad2x'>
                <label>Id Task</label>
                <input className='col12 block clean' ref='taskid' type='text' name='id' placeholder='Id will generate' />
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
                <input type='file' className='hidden'  ref='fileInput' name='uploadfile' onChange={this.handleFiles} accept=".csv"/>
                <a onClick={this.triggerFileInput} className='button pad2x  quiet'>Choose CSV</a>
              </fieldset>
               <fieldset className='pad2x'>
                 {csvtable}
               </fieldset>  
              <div className='pad2 checkbox-pill'>
                <input type='checkbox' id='random' ref='random'  checked={this.state.selected}/>
                <a onClick={this.triggerRandom} for='random' className='button icon check quiet'>Do not load randomize the data</a>      
              </div>
              <div className='pad2x pad1y  round-bottom col12 clearfix'>
                <input className='col6 margin3 button' type='submit' value='Create Task' />
              </div>
            </form>);

    return (
          <div>
          <div>{(this.state.startupload) ? 
              ((this.state.status) ? (<h2 className='dark'>Successful upload, start to fix ...</h2>) : (<h2 className='dark'>Something went wrong on upload, try to agains</h2>)) : form}
            </div>
          </div>
    );
  }
});
module.exports = AddForm;