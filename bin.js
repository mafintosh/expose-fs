#!/usr/bin/env node

var minimist = require('minimist')
var fs = require('fs')
var path = require('path')
var localtunnel = require('localtunnel')
var createServer = require('./')

var argv = minimist(process.argv.slice(2), {alias:{port:'p', quiet:'q', help:'h', tunnel:'t'}})
var p = argv._[0] || '.'
var port = argv.port || 8441

if (argv.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8'))
  return
}

var server = createServer(p)

if (argv.tunnel) {
  var opts = {};

  localtunnel(port, function(err, tunnel) {
    if(argv.quiet) return;
    if (err) return console.log("localtunnel error", e);
    console.log('Availabe at %s', tunnel.url);
  });
}

if (!argv.quiet) {
  console.log('Exposing %s on port %d', server.root, port)

  server.on('file', function(name) {
    console.log('Returning file: %s', name)
  })

  server.on('directory', function(name) {
    console.log('Returning directory: %s', name)
  })
}

server.listen(port)