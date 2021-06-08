import { Store } from './store'
import { FsStore } from './fs-store'
import { S3Store } from './s3-store'

export interface ConnetionOptions {
  bucket?: string
  client?: any
}

export class Connection {
  uri: string
  type: string | null
  bucket: string
  store: Store
  options?: ConnetionOptions | null

  constructor(uri: string, options?: ConnetionOptions) {
    if (!uri) throw new Error("Connection URI is missing")
    this.uri = uri
    const parts = this.uri.match(/^(\w+)(:\/\/)([^\/]+)/)
    if (!parts || !parts[1]) throw new Error("No connection type " + this.uri)
    this.type = parts[1]
    if (!parts[3]) throw new Error("No bucket " + this.uri)
    this.bucket = parts[3]
    this.store = this.setStore()
  }

  private setStore(): Store {
    switch (this.type) {
      case 'file':
        return new FsStore(this.bucket)
      case 's3':
        return new S3Store(this.uri)
      default:
        throw new Error("not implemented: " + this.type)
    }
  }

  async write(key: string, content?: string): Promise<void> {
    this.store.write(key, content)
  }

  async read(key: string): Promise<string> {
    return this.store.read(key)
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key)
  }

  async deleteFolder(folder: string): Promise<void> {
    if (!folder) return
    // prevent worst cases match at least bucket
    if (!folder.match(`^(\/*)${this.bucket}\/.*`)) return
    await this.store.deleteFolder(folder)
  }

  async listFiles(folder: string): Promise<string[]> {
    return await this.store.listFiles(folder)
  }

}
