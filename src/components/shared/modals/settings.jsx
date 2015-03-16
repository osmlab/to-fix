'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      /* jshint ignore:start */
      <div id='modal-name' className='modal-popup' method='post'>
        <div className='col4 modal-body fill-white contain'>
          <a href='#close' className='quiet pad1 icon fr close'></a>
          <div className='pad1 center'>
            <h2>Settings</h2>
          </div>
          <div className='pad2x pad1y'>
            <div className='pad1y'>
              <h3 className='col3'>Editor:</h3>
              <select name='select' className='select'>
                <option value='ideditor'>iD</option>
                <option value='autoeditor' selected='true'>pick automatically</option>
                <option value='josmeditor'>JOSM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
