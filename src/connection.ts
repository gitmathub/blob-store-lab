import { Blob } from './blob'
import { FsBlob } from './fs-blob'
import { s3Blob } from './s3-blob'

export interface ConnetionOptions {
  bucket?: string
  client?: any
}

export class Connection {
  uri: string
  type: string | null
  blob: Blob
  options?: ConnetionOptions | null

  constructor(uri: string, options?: ConnetionOptions) {
    if (!uri) throw new Error("Connection URI is missing")
    this.uri = uri
    this.type = this.setType()
    this.blob = this.setBlob()
  }

  private setType(): string {
    const parts = this.uri.match(/^(\w+)(:\/\/)([^\/]+)(.*\/)(.+)$/)
    if (!parts || !parts[1]) throw new Error("No connection type " + this.uri)
    return parts[1]
  }

  private setBlob(): Blob {
    switch (this.type) {
      case 'file':
        return new FsBlob(this.uri)
      case 's3':
        return new s3Blob(this.uri)
      default:
        throw new Error("not implemented")
    }
  }

  async write(content: string): Promise<void> {
    this.blob.write(content)
  }

  async read(): Promise<string> {
    return this.blob.read()
  }

  async delete(): Promise<void> {
    await this.blob.delete()
  }

  async deleteFolder(folder: string): Promise<void> {
    if (!folder) return
    // prevent worst cases match at least bucket
    if (!folder.match(`^(\/*)${this.blob.bucket}\/.*`)) return
    await this.blob.deleteFolder(folder)
  }

  async listFiles(folder: string): Promise<string[]> {
    return await this.blob.listFiles(folder)
  }

}
