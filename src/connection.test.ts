import 'jest'
import { Connection } from './connection'

describe('file connection', () => {
  const uri = "file://test-bucket/foo/bar/test.txt"

  xit('can create file connection', () => {
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.key).toBe('foo/bar/test.txt')
  })

  it('writes content to file', () => {
    const connection = new Connection(uri)
    const content = "shoo be doo"
    expect(() => connection.write(content)).not.toThrow()
  })

  it('reads from a file', async () => {
    const connection = new Connection(uri)
    // expect(async() => await connection.read()).not.toThrow()
    console.log(await connection.read())
  })
  // it('write throws error', () => {
  //   const uri = "file://test-bucket/foo/bar/test.txt"
  //   const content = "shoo be doo"
  //   const connection = new Connection(uri)
  //   expect(() => {connection.write(content)}).toThrowError()
  // })
})
