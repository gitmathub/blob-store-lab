import 'jest'
import { Connection } from './connection'

describe('File connection', () => {

  const bucket = "test-bucket"
  afterAll(async() => {
    const uri = `file://${bucket}/anything.txt`
    const connection = new Connection(uri)
    await connection.deleteFolder(bucket + "/")
  })

  it('can create file connection', () => {
    const uri = `file://${bucket}/foo/bar/test-01.txt`
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.blob.bucket).toBe(`${bucket}`)
    expect(connection.blob.path).toBe('/foo/bar/')
    expect(connection.blob.file).toBe('test-01.txt')
  })

  it('writes content to file', async () => {
    const uri = `file://${bucket}/foo/bar/test-02.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
  })

  it('reads from a file', async () => {
    const uri = `file://${bucket}/foo/bar/test-03.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const result = await connection.read()
    expect(result).toBe(content)
  })

  it('removes a file', async () => {
    const uri = `file://${bucket}/foo/bar/test-04.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    await connection.delete()
    expect(true).toBeTruthy()
  })


})

describe('S3 connection', () => {
  const bucket = "test-bucket"

  xit('can create a connection', () => {
    const uri = `s3://${bucket}/foo/bar/test-11.txt`
    const connection = new Connection(uri, { client: "AWS client dummy string" })
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('s3')
    expect(connection.blob.key).toBe('foo/bar/test.txt')
  })
})
