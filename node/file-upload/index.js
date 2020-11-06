const fs = require('fs')
const express = require('express')

const app = express()

const pathForUploads = './uploads'

if (!fs.existsSync(pathForUploads)) {
  fs.mkdirSync(pathForUploads)
}

app.get('/', (req, res) => {
  res.send('GET')
})

app.post('/:filename', (req, res) => {
  req.pipe(fs.createWriteStream(`${pathForUploads}/${req.params.filename}`))

  req.on('end', () => res.status(200).end());
})

app.put('/:filename', (req, res) => {
  req.pipe(fs.createWriteStream(`${pathForUploads}/${req.params.filename}`))

  req.on('end', () => res.status(200).end());
})

app.listen(3000)
