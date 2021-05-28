
const fsBlob = require('fs-blob-store')
const memoryBlob = require('abstract-blob-store')

const s3Blob = require('s3-blob-store')
const AWS = require('aws-sdk');


// TODO: these lines goto tests
// const uri: string = "file://foo/bar/baz/text.txt"
// const uri: string = "memory://foo/bar/baz/text.txt"
const uri: string = "s3://foo/bar/baz/text.txt"
const content: string = "hello du xsx"
const bucket: string = "test-bucket"

export function write(uri: string, content: any) {
  const {type, path} = getStoreTypeAndPath(uri)
  const store = createStore(type, bucket)
  const stream = store.createWriteStream({ key: path }, () => {})
  stream.write(content)
  stream.end
}

export function read(uri: string, out) {
  const {type, path} = getStoreTypeAndPath(uri)
  const store = createStore(type, bucket)
  const stream = store.createReadStream({ key: path }, () => {})
  stream.pipe(out)
  stream.end
}

function getStoreTypeAndPath(uri: string): any {
  const uriParts = uri.match(/^(\w+)(:\/\/)(.+)$/)
  return ({type: uriParts[1], path: uriParts[3]})
}

function createStore(type: string, bucket: string) {
  switch (type) {

    case 'file':
      return fsBlob(bucket)

    case 's3':

      const serverUrl = 'http://127.0.0.1:4568'

      const client = new AWS.S3({
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        endpoint: new AWS.Endpoint(serverUrl),
        sslEnabled: false,
        s3ForcePathStyle: true
      });
    
      const store = s3Blob({
        client: client,
        bucket: bucket
      });
      return store

    default:
      return new memoryBlob()
  }
}