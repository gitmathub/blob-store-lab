import { readFile, rm } from 'fs/promises';

export interface ConnetionOptions {
  bucket?: string
  client?: any
}

export class Connection {
  uri: string
  type: string | null
  bucket: string
  path: string
  file: string
  key: string
  store: any
  options?: ConnetionOptions | null

  constructor(uri: string, options?: ConnetionOptions) {
    if (!uri) throw new Error("Connection URI is missing")
    this.uri = uri
    this.options = options || null
    const parts = this.uri.match(/^(\w+)(:\/\/)([^\/]+)(.*\/)(.+)$/)
    this.type = parts ? parts[1] : null
    this.bucket = parts ? parts[3] : ''
    this.path = parts ? parts[4] : ''
    this.file = parts ? parts[5] : ''
    this.key = this.path + this.file
    this.store = this.setStore()
  }

  private setStore(): any {
    let store
    switch (this.type) {
      case 'file':
        // store = require('fs-blob-store')
        // store = require('./fs-blob-store') // use patched lib
        store = require('fs')
        this.key = this.bucket + this.path + this.file
        return store
      case 's3':
        store = require('s3-blob-store')
        return store({ client: this.options?.client, bucket: this.bucket })
      default:
        throw new Error("not implemented")
    }
  }

  async write(content: string): Promise<void> {
    // file
    // check on fsPromises.mkdir(path[, options])
    const mkdirp = require('mkdirp-classic')
    await mkdirp.sync(this.bucket + this.path)
    // common
    const stream = this.store.createWriteStream(this.key)
    await stream.write(content)
    stream.end()
  }

  async read(): Promise<string> {
    return (await readFile(this.key)).toString();
    // const stream = this.store.createReadStream(this.key)
    // let result = ''
    // for await (const chunk of stream) {
    //   result += chunk;
    // }
    // return result;
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