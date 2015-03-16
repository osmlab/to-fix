'use strict';

var md5 = require('crypto');

function zeroPad(x, len) {
    if (typeof x === 'number') x = x.toString(16);
    return (new Array(len - x.length + 1).join('0') + x);
}

function compose(skipval, hash) {
    return zeroPad(skipval, 4) + '-' + hash;
}

function decompose(id) {
    id = id.split('-');
    return {
        skipval: parseInt(id[0]),
        hash: id[1]
    };
}

// here purely to ensure that a single hash function is used throughout
function hashObject(obj) {
    return md5
        .createHash('md5')
        .update(JSON.stringify(obj))
        .digest('hex');
}

module.exports = {
    compose: compose,
    decompose: decompose,
    hashObject: hashObject
};
