import 'jest'
import { Connection } from './connection-bucket-ts'

describe('Bucket-TS file connection', () => {
  const uri = "file://test-bucket/foo/bar/test.txt"
  const options = {
    "bucketName": "test-bucket",
    "createMissingFolders": true
  }

  it('can create file connection', () => {
    const connection = new Connection(uri, options)
    expect(connection.uri).toBe(uri)
    expect(connection.options).toBe(options)
    expect(connection.type).toBe('file')
    expect(connection.bucket).toBe(options.bucketName)
    expect(connection.key).toBe('foo/bar/test.txt')
  })

  // it('write content to file', () => {
  //   const connection = new Connection(uri, options)
  //   const content = "shoo be doo"
  //   expect(() => {connection.write(content)}).toBeTruthy()
  // })

  // it('write throws error', () => {
  //   const uri = "file://test-bucket/foo/bar/test.txt"
  //   const content = "shoo be doo"
  //   const connection = new Connection(uri)
  //   expect(() => {connection.write(content)}).toThrowError()
  // })
})
