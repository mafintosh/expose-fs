#!/usr/bin/env node

var minimist = require('minimist')
var createServer = require('./')

var argv = minimist(process.argv.slice(2), {alias:{port:'p'}})
var p = argv._[0] || '.'
var port = argv.port || 8441

var server = createServer(p)

console.log('Exposing %s on port %d', server.root, port)

server.on('file', function(name) {
  console.log('Returning file: %s', name)
})

server.on('directory', function(name) {
  console.log('Returning directory: %s', name)
})

server.listen(port)