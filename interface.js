"use strict";
exports.__esModule = true;
exports.write = void 0;
var fsBlob = require("fs-blob-store");
var uri = "file://foo/bar/baz/text.txt"; // s3://
var param = "hello du xx";
var bucket = "tmp";
write(uri, param);
function write(uri, param) {
    var _a = getStoreTypeAndPath(uri), type = _a.type, path = _a.path;
    var store = createStore(type, bucket);
    var stream = store.createWriteStream({ key: path });
    stream.write(param);
    stream.end;
}
exports.write = write;
function getStoreTypeAndPath(uri) {
    var uriParts = uri.match(/^(file)(:\/\/)(.+)$/);
    return ({ type: uriParts[1], path: uriParts[3] });
}
function createStore(type, bucket) {
    switch (type) {
        case 'file':
            return fsBlob(bucket);
        default:
            return fsBlob(bucket);
    }
}
