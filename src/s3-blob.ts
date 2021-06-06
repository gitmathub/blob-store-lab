import { Blob, BlobOptions } from './blob'

export class s3Blob implements Blob {
  uri: string
  bucket: string
  path: string
  file: string
  key: string
  options?: BlobOptions | null

  constructor(uri: string, options?: BlobOptions) {
    if (!uri) throw new Error("Connection URI is missing")
    this.uri = uri
    this.options = options || null
    const parts = this.uri.match(/^(\w+)(:\/\/)([^\/]+)(.*\/)(.+)$/)
    this.bucket = parts ? parts[3] : ''
    this.path = parts ? parts[4] : ''
    this.file = parts ? parts[5] : ''
    this.key = this.bucket + this.path + this.file
  }

  async write(content: string): Promise<void> {
  }

  async read(): Promise<string> {
    return Promise.resolve("")
  }

  async delete(): Promise<void> {
  }

  async deleteFolder(folder: string): Promise<void> {
  }

  async listFiles(folder: string): Promise<string[]> {
    return Promise.resolve([""])
  }
}
