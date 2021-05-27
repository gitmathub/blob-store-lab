
import * as fsBlob from 'fs-blob-store'

const uri: string = "file://foo/bar/baz/text.txt" // s3://
const param: string = "hello du xx"
const bucket: string = "tmp"
write(uri, param)

export function write(uri: string, param: any) {
  const {type, path} = getStoreTypeAndPath(uri)
  const store = createStore(type, bucket) 
  const stream = store.createWriteStream({ key: path })
  stream.write(param)
  stream.end
}

function getStoreTypeAndPath(uri: string) {
  const uriParts: string[] = uri.match(/^(file)(:\/\/)(.+)$/)
  return ({type: uriParts[1], path: uriParts[3]})
}

function createStore(type: string, bucket: string) {
  switch (type) {
    case 'file':
      return fsBlob(bucket)
    default:
      return fsBlob(bucket)
  }
}