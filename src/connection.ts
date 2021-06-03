
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
        // store = require('fs-blob-store')
        store = require('./fs-blob-store') // use patched lib
        return store(this.bucket)
      case 's3':
        store = require('s3-blob-store')
        return store({ client: this.options?.client, bucket: this.bucket })
      default:
        throw new Error("not implemented")
    }
  }

  async write(content: string): Promise<void> {
    const stream = this.store.createWriteStream({ key: this.key })
    // const fs = require('fs')
    // const stream = fs.createWriteStream("/Users/mat/Tui/blob-store-lab/test-bucket/tttt.txt")
    await sleep()
    return stream.write(content)
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
    await this.store.remove({ key: this.key }, () => { })
  }
}

function sleep(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 4000)
  })
}