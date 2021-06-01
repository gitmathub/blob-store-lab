
export interface ConnetionOptions {
  tobedefined: string
}
export class Connection {
  uri: string
  type: string | null
  bucket: string | null
  key: string | null
  store: any
  options?: ConnetionOptions | null

  constructor(uri: string, options?: ConnetionOptions) {
    if (!uri) throw new Error("Connection URI is missing")
    this.uri = uri
    this.options = options || null
    this.type = this.setType(uri)
    this.bucket = this.setBucket(uri)
    this.key = this.setKey(uri)
    this.store = this.setStore()
  }

  private setType(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[1]) || null
  }

  private setBucket(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[3]) || null
  }

  private setKey(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[4]) || null
  }

  private setStore(): any {
    switch (this.type) {
      case 'file':
        const store = require('fs-blob-store')
        return store(this.bucket)
      default:
        throw new Error("not implemented")
    }
  }

  write(content: string) {
    try {
      const stream = this.store.createWriteStream({ key: this.key })
      stream.write(content).end
    } catch (e) {
      throw new Error("write failed " + e)
    }
  }

  async read() {
    var from = require('from2-array')
    var concat = require('concat-stream')
    const rs = this.store.createReadStream({ key: this.key })
    const result = await rs.pipe( concat( (data: any) => { return data.toString()}))
    return result
    // let content = ""
    // try {
    //   const stream = this.store.createReadStream({ key: this.key })
    //     // .pipe(process.stdout)
    //     // console.log("Stream", stream)
    //   stream.on("end", (data: any) => {
    //     content += data.toString()
    //       // console.log("D", data.toString())
    //       // content += data.toString()
    //       // return content
    //     })
    //     return content/


  // } catch(e) {
  //   throw new Error("read failed " + e)
  // }
}

  // setBucket(uri: string) {
  //   return uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)[3]
  // }
  // findStoreTypeAndPath(uri: string): any {
  //   const uriParts = uri.match(/^(\w+)(:\/\/)(.+)$/)
  //   return ({type: uriParts[1], path: uriParts[3]})
  // }

  // switch (type) {

  //   case 'file':
  //     return fsBlob(bucket)

  //   case 's3':

  //     const serverUrl = 'http://127.0.0.1:4568'

  //     const client = new AWS.S3({
  //       accessKeyId: 'S3RVER',
  //       secretAccessKey: 'S3RVER',
  //       endpoint: new AWS.Endpoint(serverUrl),
  //       sslEnabled: false,
  //       s3ForcePathStyle: true
  //     });

  //     const store = s3Blob({
  //       client: client,
  //       bucket: bucket
  //     });
  //     return store

  //   default:
  //     return new memoryBlob()
  // }
}