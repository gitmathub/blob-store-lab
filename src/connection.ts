
export interface ConnetionOptions {
  bucket?: string
  client?: any 
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
    this.type = this.setType()
    this.bucket = this.setBucket()
    this.key = this.setKey()
    this.store = this.setStore()
  }

  private setType(): string | null {
    const match = this.uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[1]) || null
  }

  private setBucket(): string | null {
    const match = this.uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[3]) || null
  }

  private setKey(): string | null {
    const match = this.uri.match(/^(\w+)(:\/\/)([^\/]+)\/(.+)$/)
    return (Array.isArray(match) && match[4]) || null
  }

  private setStore(): any {
    let store
    switch (this.type) {
      case 'file':
        store = require('fs-blob-store')
        return store(this.bucket)
      case 's3':
        store = require('s3-blob-store')
        return store({client: this.options?.client, bucket: this.bucket})
      default:
        throw new Error("not implemented")
    }
  }

  async write(content: string): Promise<void> {
    try {
      const stream = this.store.createWriteStream({ key: this.key })
      return stream.write(content)
    } catch (e) {
      throw new Error("write failed " + e)
    }
  }

  async read(): Promise<string> {
    const stream = this.store.createReadStream({ key: this.key })
    let result = ''
    for await (const chunk of stream) {
      result += chunk;
    }
    return result;
  }

  async delete(): Promise<void> {
    await this.store.remove({ key: this.key }, ()=>{})
  }
}