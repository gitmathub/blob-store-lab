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
    // suitable test is missing
  })

  it('writes a file and reads from that file', async () => {
    const uri = `file://${bucket}/foo/bar/test-03.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const result = await connection.read()
    expect(result).toBe(content)
  })

  it('writes and lists a file', async () => {
    const path = `${bucket}/foo/bar/`
    const file = `test-04.txt`
    const uri = `file://${path}${file}`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(1)
  })

  it('removes a file', async () => {
    const path = `${bucket}/foo/bar/`
    const file = `test-05.txt`
    const uri = `file://${path}${file}`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    await connection.delete()
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(0)
  })
})
