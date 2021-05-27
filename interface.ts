import * as fsBlob from 'fs-blob-store'

const uri = "file://foo/bar/baz/text.txt"
write(uri)

export function write(uri:string) {
  const uriParts: string[] = uri.match(/^(file)(:\/\/)(.+)$/)
  const type = uriParts[1]
  const path = uriParts[3]
  
  const store = fsBlob('tmp')
  switch (type) {
    case 'file':
      console.log("file")
      break
    case 's3':
      console.log("file")
      break
    default:
      console.log("no type match")
  }
}
//   const stream = store.createWriteStream({
//   }, function (err, opts) {
//     console.log('done')
//     store.createReadStream(opts).pipe(process.stdout)
//   })

//   stream.write('hello ')
//   stream.end('world\n')
// }