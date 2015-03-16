'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      /* jshint ignore:start */
      <div className='col12 clearfix'>
        <div className='col8 pad2 margin2 space-top2 fill-white'>
          <h2 className='space-bottom2'>Upload</h2>
          <form id='upload-form' action='http://localhost:8000/csv' method='post'>
            <fieldset>
              <label for='file'>CSV:</label>
              <input id='file' type='file' name='thefile' />
            </fieldset>
            <fieldset>
              <label class='col12' for='name'>Task name (for the sidebar)</label>
              <input class='col12' id='name' type='text' name='name' />
            </fieldset>
            <fieldset>
              <label class='col12' for='password'>Password:</label>
              <input class='col12' id='password' type='password' name='uploadPassword' />
            </fieldset>
            <fieldset>
              <input id='submit' type='submit' />
            </fieldset>
          </form>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
