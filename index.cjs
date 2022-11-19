const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const expres = require('express');

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server connected at http://${hostname}:${port}/`);
});