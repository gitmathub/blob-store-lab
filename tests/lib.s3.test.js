const tape = require('tape')
const tests = require('abstract-blob-store/tests')

console.log("S3 Blob")
const AWS = require('aws-sdk');
const s3Blob = require('s3-blob-store')
const S3erver = require('s3rver');
const tmpDir = require('tmp').dirSync();
const format = require('util').format;

const S3_BUCKET = 'test-bucket';

const server = new S3erver({
  directory: tmpDir.name,
  silent: true,
  configureBuckets: [{
    name: S3_BUCKET
  }]
});

server.run(function (err, options) {
  if (err) throw err;

  const serverUrl = format('http://%s:%d', options.address, options.port);

  const client = new AWS.S3({
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: new AWS.Endpoint(serverUrl),
    sslEnabled: false,
    s3ForcePathStyle: true
  });

  const store = s3Blob({
    client: client,
    bucket: S3_BUCKET
  });


  tests(tape, {
    setup: function (_t, cb) {
      cb(null, store);
    },
    teardown: function (_t, store, blob, cb) {
      if (blob) store.remove(blob, cb);
      else cb();
    }
  })
  tape.onFinish(function () {
    server.close();
  });
})
