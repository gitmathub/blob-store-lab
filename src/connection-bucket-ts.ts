import getBucketProvider, { BucketProviderExt } from 'bucket-ts';
import 'bucket-ts-folder';

export interface BucketOptions {
  bucketName: string
  createMissingFolders?: boolean
}
export class Connection {
  uri: string
  type: string | null
  bucket: string | null
  key: string | null
  store: any
  options: BucketOptions

  constructor(uri: string, options: BucketOptions) {
    this.uri = uri
    this.options = options
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

  private setStore(): BucketProviderExt {
    switch(this.type) {
      case 'file':
        return getBucketProvider('folder', this.options)
      default:
        throw new Error("not implemented")
    }
  }

  // async upload(file: string): void {
  //   try {
  //     await this.store.uploadFile(file, this.key);
  //     let files = await bp.listFiles({ prefix: 'foo/bar/' });
  //     expect(files.results.length).toBe(1);
  //   } catch (e) {
  //     throw new Error("write failed " + e)
  //   }
  // }
}