var http = require('http')
var fs = require('fs')
var after = require('after-all')
var pump = require('pump')
var path = require('path')
var mkdirp = require('mkdirp')
var cors = require('cors')
var url = require('url')

module.exports = function(root) {
  if (!root) root = '/'
  root = fs.realpathSync(root)

  var onrequest = function(req, res) {
    var qs = url.parse(req.url, true).query

    var trim = function(u) {
      u = u.replace(root, '')
      if (u[0] !== '/') u = '/'+u
      return u
    }

    var onerror = function(err) {
      if (!err) return res.end()
      res.statusCode = err.code === 'ENOENT' ? 404 : 500
      res.end(err.message)
    }

    var name = path.join('/', req.url.split('?')[0]).replace(/%20/g, '\ ')
    var u = path.join(root, name)

    if (req.method === 'POST') return mkdirp(u, onerror)
    if (req.method === 'PUT') return pump(req, fs.createWriteStream(u), onerror)

    var onfile = function(st) {
      server.emit('file', u, st)
      res.setHeader('Content-Length', st.size)
      pump(fs.createReadStream(u), res)
    }

    var ondirectory = function(st) {
      server.emit('directory', u, st)
      fs.readdir(u, function(err, files) {
        if (err) return onerror(err)

        var next = after(function() {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files))
        })

        files.forEach(function(file, i) {
          var n = next()

          fs.stat(path.join(u, file), function(err, st) {
            if (err) return n(err)

            files[i] = {
              name: file,
              path: trim(path.join(u, file)),
              mountPath: path.join(u, file),
              type: st.isDirectory() ? 'directory' : 'file',
              size: st.isDirectory() ? null : st.size,
              creationTimestamp: st.isDirectory() ? null : st.birthtimeMs,
              extension: st.isDirectory()
                         ? null
                         : (path.extname(file).length > 0
                            ? path.extname(file).substring(1)
                            : (file.startsWith('.')
                               ? file.substring(1)
                               : null)
                           )
            }

            n()
          })
        })
      })
    }

    fs.stat(u, function(err, st) {
      if (err) return onerror(err)
      if (st.isDirectory()) return ondirectory(st)
      onfile(st)
    })
  }

  var c = cors()
  var server = http.createServer(function(req, res) {
    c(req, res, function() {
      onrequest(req, res)
    })
  })

  server.root = root

  return server
}