'use strict';

var actions = require('../actions/actions');

module.exports = function(obj) {
  var err = 'Unknown error occurred';

  if (obj && obj.status) {
    switch (obj.status) {
      case 410: // GONE
      err = 'A task loaded was already complete';
      break;
    }
  }

  actions.errorDialog(err);
};
