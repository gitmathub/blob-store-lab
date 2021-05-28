
export class Connection {
  uri: string
  type: string | null
  bucket: string | null
  key: string | null

  constructor(uri: string) {
    this.uri = uri 
    this.type = this.setType(uri)
    this.bucket = this.setBucket(uri)
    this.key = this.setKey(uri)
  }

  private setType(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/) 
    return (match && match[1]) || null
  }

  private setBucket(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/) 
    return (match && match[3]) || null
  }  

  private setKey(uri: string): string | null {
    const match = uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/) 
    return (match && match[4]) || null
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