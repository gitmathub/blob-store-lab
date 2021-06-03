const mkdirp = require('mkdirp-classic')
const LRU = require('lru-cache')
const eos = require('end-of-stream')
const duplexify = require('duplexify')
const path = require('path')
const fs = require('fs')

const noop = function() {}

const join = function(root, dir) {
  return path.join(root, path.resolve('/', dir).replace(/^[a-zA-Z]:/, ''))
}

const listen = function(stream, opts, cb) {
  if (!cb) return stream
  eos(stream, function(err) {
    if (err) return cb(err)
    cb(null, opts)
  })
  return stream
}

const BlobStore = function (opts) {
  if (!(this instanceof BlobStore)) return new BlobStore(opts)
  if (typeof opts === 'string') opts = {path:opts}

  this.path = opts.path
  this.cache = new LRU(opts.cache || 100)
}

BlobStore.prototype.createWriteStream = function(opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  if (opts.name && !opts.key) opts.key = opts.name

  const key = join(this.path, opts.key)
  const dir = path.dirname(key)

  mkdirp(dir)
  return fs.createWriteStream(key, opts)
}

BlobStore.prototype.createReadStream = function(key, opts) {
  if (key && typeof key === 'object') return this.createReadStream(key.key, key)
  return fs.createReadStream(join(this.path, key), opts)
}

BlobStore.prototype.exists = function(opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  const key = join(this.path, opts.key)
  fs.stat(key, function(err, stat) {
    if (err && err.code !== 'ENOENT') return cb(err)
    cb(null, !!stat)
  })
}

BlobStore.prototype.remove = function(opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  if (!opts) opts = noop
  const key = join(this.path, opts.key)
  fs.unlink(key, function(err) {
    if (err && err.code !== 'ENOENT') return cb(err)
    cb()
  })
}

module.exports = BlobStore
