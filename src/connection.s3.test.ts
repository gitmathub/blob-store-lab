import 'jest'
import { Connection } from './connection'
const tmpDir = require('tmp').dirSync()
const S3rver = require('s3rver')
const AWS = require('aws-sdk')

let instance: typeof S3rver;

describe('S3 connection', () => {

  const bucket = "test-bucket"
  // TODO: makd this env variable


  beforeAll((done) => {
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

  it('can create file connection', () => {
    const uri = `s3://${bucket}/foo/bar/test-11.txt`
    const connection = new Connection(uri, { client })
    expect(connection.uri).toBe(uri)
    expect(connection.type).toBe('s3')
    expect(connection.blob.bucket).toBe(`${bucket}`)
    expect(connection.blob.path).toBe('/foo/bar/')
    expect(connection.blob.file).toBe('test-11.txt')
  })

  xit('writes content to file', async () => {
    const uri = `file://${bucket}/foo/bar/test-02.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    // suitable test is missing
  })

  xit('writes a file and reads from that file', async () => {
    const uri = `file://${bucket}/foo/bar/test-03.txt`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const result = await connection.read()
    expect(result).toBe(content)
  })

  xit('writes and lists a file', async () => {
    const path = `${bucket}/foo/bar/`
    const file = `test-04.txt`
    const uri = `file://${path}${file}`
    const connection = new Connection(uri)
    const content = "shoo be doo"
    await connection.write(content)
    const files = await connection.listFiles(path)
    expect(files.filter(f => f === file).length).toBe(1)
  })

  xit('removes a file', async () => {
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
