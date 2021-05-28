const S3erver = require('s3rver');
const tmpDir = require('tmp').dirSync();
const format = require('util').format;

const S3_BUCKET = 'test-bucket';

const server = new S3erver({
  directory: tmpDir.name,
  silent: false,
  configureBuckets: [{
    name: S3_BUCKET
  }]
});

server.run(function (err, options) {
  if (err) throw err;

  const serverUrl = format('http://%s:%d', options.address, options.port);
  console.log("Server runnig on ", serverUrl)
})