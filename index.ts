
const fsBlob = require('fs-blob-store')
const memoryBlob = require('abstract-blob-store')

// TODO: these lines goto tests
const uri: string = "file://foo/bar/baz/text.txt"
// const uri: string = "memory://foo/bar/baz/text.txt"
const content: string = "hello du xsx"
const bucket: string = "tmp"
write(uri, content)
read(uri, process.stdout) //TODO: works for file but not memory yet

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

function getStoreTypeAndPath(uri: string) {
  const uriParts: string[] = uri.match(/^(\w+)(:\/\/)(.+)$/)
  return ({type: uriParts[1], path: uriParts[3]})
}

function createStore(type: string, bucket: string) {
  switch (type) {
    case 'file':
      return fsBlob(bucket)
    case 's3':
      console.log('s3 is not implemented yet')
      break
    default:
      return new memoryBlob()
  }
}