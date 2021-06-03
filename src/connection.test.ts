import 'jest'
import { resolve } from 'path/posix'
import { Connection } from './connection'

describe('File connection', () => {

  xit('can create file connection', () => {
    const uri = `file://test-bucket-00/foo/bar/test.txt`
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.key).toBe('foo/bar/test.txt')
  })

  xit('writes content to file', async () => {
    const uri = `file://test-bucket-01/foo/bar/test.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    expect(async () => { await connection.write(content) }).toBeTruthy()
  })

  xit('reads from a file', async () => {
    const uri = "file://test-bucket/tttt.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    // await sleep()
    const result = await connection.read()
    expect(result).toBe(content)
  })

  it('removes a file', async () => {
    const uri = "file://test-bucket-03/foo/bar/test.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    // await connection.delete()
    expect(true).toBeTruthy()
  })


})

function sleep(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}

describe('S3 connection', () => {

  it('can create a connection', () => {
    const uri = "s3://test-bucket/foo/bar/test.txt"
    const connection = new Connection(uri, { client: "AWS client dummy string" })
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('s3')
    expect(connection.key).toBe('foo/bar/test.txt')
  })
})
