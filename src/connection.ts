
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
    const stream = this.store.createReadStream({ key: this.key })
    let result = ''
    for await (const chunk of stream) {
      result += chunk;
    }
    return result;
  }
}