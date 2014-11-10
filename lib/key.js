/*
=== to-fix IDs are strings composed according to the following scheme:
- 4 hexadecimal characters for skipval
- followed by 32 hexadecimal characters for the hash/unique ID (currently an MD5 hash)
- skipval is returned as a number, because it needs to be manipulated outside these functions
- hash is returned as a string because it's just an identifier & should not be transformed
- skipval=0 indicates a feature that has been fixed
- new tasks are initialized with skipval=1
- tasks served to the user must therefore have IDs greater than TASK_RANGE_LOWER_BOUND: '0000fffffffffffffffffffffffffffffff'
- if a task is skipped, its skipval is incremented, putting it at the end of the queue
- an object may be located by using its hash and iterating through skipvals until it is found
*/

var md5 = require('MD5');

var SKIPVAL_CHARS = 4;
var HASH_CHARS = 32;
var TASK_RANGE_LOWER_BOUND = new Array(SKIPVAL_CHARS+1).join('0') + new Array(HASH_CHARS+1).join('f');

function zeroPad(x, len){
    if (typeof(x)==='number') x = x.toString(16);
    return (new Array(len - x.length + 1).join('0') + x);
}

function composeID(skipval, hash){
    return zeroPad(skipval, SKIPVAL_CHARS) + zeroPad(hash, HASH_CHARS);    
}

function decomposeID(id){
    return {
        skipval: parseInt(id.slice(0, SKIPVAL_CHARS), 16),
        hash: id.slice(SKIPVAL_CHARS, SKIPVAL_CHARS + HASH_CHARS)
    };
}

// here purely to ensure that a single hash function is used throughout
function hashObject(obj){
    return md5(JSON.stringify(obj));
}

module.exports = {
    composeID: composeID,
    decomposeID: decomposeID,
    hashObject: hashObject,
    TASK_RANGE_LOWER_BOUND: TASK_RANGE_LOWER_BOUND
};
