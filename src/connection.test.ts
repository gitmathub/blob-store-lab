import 'jest'
import { Connection } from './connection'

describe('File connection', () => {

  it('can create file connection', () => {
    const uri = `file://test-bucket/foo/bar/test-01.txt`
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.key).toBe('foo/bar/test-01.txt')
  })

  it('writes content to file', async () => {
    const uri = `file://test-bucket/foo/bar/test-02.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    // connection.write(content, ()=> {expect(true).toBeFalsy()})
    connection.write(content, (err: any, other: any) => { 
      // expect(err).toBeUndefined()
      console.log("HERE")
    })
  })

  xit('reads from a file', async () => {
    const uri = "file://test-bucket/foo/bar/test-03.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    const result = connection.write(content, () => connection.read())
    // await sleep()
    // const result = await connection.read()
    expect(result).toBe(content)
  })

  xit('removes a file', async () => {
    const uri = "file://test-bucket/foo/bar/test-04.txt"
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    // await sleep()
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

  xit('can create a connection', () => {
    const uri = "s3://test-bucket/foo/bar/test-11.txt"
    const connection = new Connection(uri, { client: "AWS client dummy string" })
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('s3')
    expect(connection.key).toBe('foo/bar/test.txt')
  })
})
