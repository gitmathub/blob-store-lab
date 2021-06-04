export interface BlobOptions {
  bucket?: string
  client?: any
}

export interface Blob {
  uri: string
  bucket: string
  path: string
  file: string
  key: string
  options?: BlobOptions | null

  write(content: string): Promise<void>
  read(): Promise<string> 
  delete(): Promise<void> 
  deleteFolder(folder: string): Promise<void> 
  listFiles(folder: string): Promise<string[]>
}
