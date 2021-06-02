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

  it('writes content to file', () => {
    const connection = new Connection(uri)
    const content = "shoo be doo"
    expect(() => connection.write(content)).not.toThrow()
  })

  it('reads from a file', async () => {
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const result = await connection.read()
    expect(result).toBe(content)
  })
})