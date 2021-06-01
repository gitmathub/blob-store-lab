import 'jest'
import { Connection } from './connection'

describe('file connection', () => {
  const uri = "file://test-bucket/foo/bar/test.txt"

  it('can create file connection', () => {
    const connection = new Connection(uri)
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.key).toBe('foo/bar/test.txt')
  })

  it('write content to file', () => {
    const connection = new Connection(uri)
    const content = "shoo be doo"
    expect(async() => await connection.write(content)).not.toThrow()
  })

  // it('write throws error', () => {
  //   const uri = "file://test-bucket/foo/bar/test.txt"
  //   const content = "shoo be doo"
  //   const connection = new Connection(uri)
  //   expect(() => {connection.write(content)}).toThrowError()
  // })
})
