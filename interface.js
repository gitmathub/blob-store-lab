"use strict";
exports.__esModule = true;
exports.write = void 0;
var fsBlob = require("fs-blob-store");
var uri = "file://foo/bar/baz/text.txt";
write(uri);
function write(uri) {
    var uriParts = uri.match(/^(file)(:\/\/)(.+)$/);
    var type = uriParts[1];
    var path = uriParts[3];
    var store = fsBlob('tmp');
    switch (type) {
        case 'file':
            console.log("file");
            break;
        default:
            console.log("no type match");
    }
}
exports.write = write;
//   const stream = store.createWriteStream({
//   }, function (err, opts) {
//     console.log('done')
//     store.createReadStream(opts).pipe(process.stdout)
//   })
//   stream.write('hello ')
//   stream.end('world\n')
// }
