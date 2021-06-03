import 'jest'
import { Connection } from './connection'

describe('File connection', () => {

  it('can create file connection', () => {
    const uri = `file://test-bucket-00/foo/bar/test.txt`
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.key).toBe('foo/bar/test.txt')
  })

  it('writes content to file', async () => {
    const uri = `file://test-bucket-01/foo/bar/test.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    expect(async () => {await connection.write(content)}).not.toThrow()
  })

  it('reads from a file', async () => {
    const uri = "file://test-bucket-02/foo/bar/test.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const result = await connection.read()
    expect(result).toBe(content)
  })

  it('removes a file', async () => {
    const uri = "file://test-bucket-03/foo/bar/test.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    await connection.delete()
    expect(true).toBeTruthy()
  })


})

describe('S3 connection', () => {

  it('can create a connection', () => {
    const uri = "s3://test-bucket/foo/bar/test.txt"
    const connection = new Connection(uri, {client: "AWS client dummy string"})
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('s3')
    expect(connection.key).toBe('foo/bar/test.txt')
  })
})
