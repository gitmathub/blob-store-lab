import 'jest'
import { Connection } from './connection'
const tmpDir = require('tmp').dirSync()
const S3rver = require('s3rver')
const AWS = require('aws-sdk')

let instance: typeof S3rver;

describe('S3 connection', () => {

  let connection: Connection
  const bucket = "test-s3-bucket"
  const uri = `file://${bucket}`

  beforeAll((done) => {
    connection = new Connection(uri)
    instance = new S3rver({
      port: 8082,
      hostname: 'localhost',
      silent: false,
      directory: tmpDir.name,
      configureBuckets: [{
        name: bucket
      }],
      resetOnClose: true // remove all bueckts on server lcose
    }).run(done)
  })

  const client = new AWS.S3({
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: new AWS.Endpoint('http://localhost:8082'),
    sslEnabled: false,
    s3ForcePathStyle: true,
  })

  afterAll((done) => {
    // const uri = `file://${bucket}/anything.txt`
    // const connection = new Connection(uri)
    // await connection.deleteFolder(bucket + "/")
    
    instance.close(done)
    // tmpDir.removeCallback()
  })

  it('can create connection', () => {
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('file')
    expect(connection.bucket).toBe(`${bucket}`)
  })
 
  xit('writes content to file', async () => {
    const key = `/foo/bar/test-02.txt`
    const content = "shoo be doo"
    await connection.write(key, content)
    // suitable test is missing
  })

  xit('writes a file and reads from that file', async () => {
    const key = `foo/bar/test-03.txt`
    const content = "shoo be doo"
    await connection.write(key, content)
    const result = await connection.read(key)
    expect(result).toBe(content)
  })

  xit('writes and lists a file', async () => {
    const path = `/foo/bar`
    const file = `test-04.txt`
    const key = `${path}/${file}`
    const content = "shoo be doo"
    await connection.write(key, content)
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(1)
  })

  xit('removes a file', async () => {
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
