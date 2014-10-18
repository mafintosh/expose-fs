# expose-fs

Expose a file system over http

```
npm install -g expose-fs
```

This install a command line tool called `expose-fs`

```
expose-fs . # expose . on port 8441
```

Then do

```
curl localhost:8441 # returns a directory listing in JSON format
curl localhost:8441/some-file.txt # returns the file content
```

Run `expose-fs --help` for additional options