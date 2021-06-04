import { Blob, BlobOptions } from './blob'
import { readFile, rm, writeFile } from 'fs/promises'
import { mkdirSync } from "fs"

export class FsBlob implements Blob {
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
    await mkdirSync(this.bucket + this.path, { recursive: true })
    await writeFile(this.key, content)
  }

  async read(): Promise<string> {
    return (await readFile(this.key)).toString();
  }

  async delete(): Promise<void> {
    return await rm(this.key)
  }

  async deleteFolder(folder: string): Promise<void> {
    if (!folder) return
    // prevent worst cases match at least bucket
    if (!folder.match(`^(\/*)${this.bucket}\/.*`)) return
    return await rm(folder, { recursive: true })
  }
}

// keep for maybe later?
function pipeStream(source: any, dest: any): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    source.on('end', () => {
      const variable = dest.toString()
      console.log("variable", variable)
      resolve(true)
    });
    source.on('error', reject(false));
    source.pipe(dest);
  })
}