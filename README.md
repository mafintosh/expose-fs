# expose-fs

Expose a file system over http

```
npm install -g expose-fs
```

## Usage

This install a command line tool called `expose-fs`

```
expose-fs . # expose . on port 8441
```

Then do

```
curl localhost:8441 # returns a directory listing in JSON format
curl localhost:8441/some-file.txt # returns the file content
curl -X PUT --data 'hello world' localhost:8441/some-file.txt # writes a file
curl -X POST localhost/some-dir # creates a new directory
```

Run `expose-fs --help` for additional options

## License

MIT