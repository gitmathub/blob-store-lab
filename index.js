"use strict";
exports.__esModule = true;
exports.read = exports.write = void 0;
var fsBlob = require('fs-blob-store');
var memoryBlob = require('abstract-blob-store');
// TODO: these lines goto tests
var uri = "file://foo/bar/baz/text.txt";
// const uri: string = "memory://foo/bar/baz/text.txt"
var content = "hello du xsx";
var bucket = "tmp";
write(uri, content);
read(uri, process.stdout); //TODO: works for file but not memory yet
function write(uri, content) {
    var _a = getStoreTypeAndPath(uri), type = _a.type, path = _a.path;
    var store = createStore(type, bucket);
    var stream = store.createWriteStream({ key: path }, function () { });
    stream.write(content);
    stream.end;
}
exports.write = write;
function read(uri, out) {
    var _a = getStoreTypeAndPath(uri), type = _a.type, path = _a.path;
    var store = createStore(type, bucket);
    var stream = store.createReadStream({ key: path }, function () { });
    stream.pipe(out);
    stream.end;
}
exports.read = read;
function getStoreTypeAndPath(uri) {
    var uriParts = uri.match(/^(\w+)(:\/\/)(.+)$/);
    return ({ type: uriParts[1], path: uriParts[3] });
}
function createStore(type, bucket) {
    switch (type) {
        case 'file':
            return fsBlob(bucket);
        case 's3':
            console.log('s3 is not implemented yet');
            break;
        default:
            return new memoryBlob();
    }
}
