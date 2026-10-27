const http = require('http')
const fs = require('fs')
const path = require('path')

const port = Number(process.env.PORT || 3000)
const root = __dirname

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0])
  const requested = pathname === '/' ? '/nisaab_zakat_calculator.html' : pathname
  const filePath = path.resolve(root, `.${requested}`)

  if (!filePath.startsWith(root)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' })
      res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error')
      return
    }

    const extension = path.extname(filePath)
    const contentType = extension === '.html' ? 'text/html; charset=utf-8' : 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Nisaab preview server listening on port ${port}`)
})
