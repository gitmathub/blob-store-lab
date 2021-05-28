import 'jest'
import {Connection} from './connection'

describe('file connection', () => {

  it('can create file connection', () => {
    const uri = "file://test-bucket/foo/bar/test.txt"
    const connection = new Connection(uri)
    expect(connection.type).toBe('file')
    expect(connection.bucket).toBe('test-bucket')
    expect(connection.key).toBe('foo/bar/test.txt')
  })
})