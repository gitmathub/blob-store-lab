import 'jest'
import { Connection } from './connection'

describe('File connection', () => {

  let connection: Connection
  const bucket = "test-bucket"
  const uri = `file://${bucket}`

  beforeAll(async()=>{
    connection = new Connection(uri)
  })

  afterAll(async() => {
    // const uri = `file://${bucket}/anything.txt`
    // const connection = new Connection(uri)
    // await connection.deleteFolder(bucket + "/")
  })

  it('can create file connection', () => {
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.bucket).toBe(`${bucket}`)
  })

  it('writes content to file', async () => {
    const key = `/foo/bar/test-02.txt`
    const content = "shoo be doo"
    await connection.write(key, content)
    // suitable test is missing
  })

  it('writes a file and reads from that file', async () => {
    const key = `foo/bar/test-03.txt`
    const content = "shoo be doo"
    await connection.write(key, content)
    const result = await connection.read(key)
    expect(result).toBe(content)
  })

  it('writes and lists a file', async () => {
    const path = `/foo/bar`
    const file = `test-04.txt`
    const key = `${path}/${file}`
    const content = "shoo be doo"
    await connection.write(key, content)
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(1)
  })

  it('removes a file', async () => {
    const path = `/foo/bar/`
    const file = `test-05.txt`
    const key = `${path}${file}`
    const content = "shoo be doo"
    await connection.write(key, content)
    await connection.delete(key)
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(0)
  })
})
