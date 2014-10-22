var md5 = require('MD5');

var MD5_BITS = 128;
var MAX_MD5 = parseInt('0x' + new Array(MD5_BITS / 4).join('f'), 16);

function composeID(skipval, md5){
    return (skipval << MD5_BITS) + md5;
}

function decomposeID(id){
    return {
        skipval: (id >> MD5_BITS),
        md5: (id & MAX_MD5)
    }
}

// here purely to ensure that a single hash function is used throughout
function hashObject(obj){
    return md5(JSON.stringify(obj));
}

module.exports = {
    composeID: composeID,
    decomposeID: decomposeID,
    hashObject: hashObject
}