//D:\WORKSPACES\WEBTST\LEARNJS\LS0\03-streams\03-file-server-get
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();
/*
server.on('request', (req, res) => {
  console.log("server.on");
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  console.log("filepath =", filepath);

  switch (req.method) {
    case 'GET':
      console.log("case get");
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
*/


server.on('request', (req, res) => {
  console.log("server.on");
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // console.log("url.pathname =", url.pathname);
  const pathname = url.pathname.slice(1); // get pathname without first "/"
  // const pathname = url.pathnam
  console.log("pathname =", pathname); // see pathname docs returned string free from params
  // let stringPathArray = pathname.split("/").length; //get subdirs count
  // console.log("pathname.split('/').length =", pathname.split("/").length);
  // console.log("dirname =", __dirname); //D:\WORKSPACES\WEBTST\LEARNJS\NODESRV
  const filepath = path.join(__dirname, 'files', pathname); // get full filepath like D:\WORKSPACES\WEBTST\LEARNJS\NODESRV\files\xxl\cvbb
  console.log("filepath =", filepath);

  switch (req.method) {
    case 'GET':
      console.log('case get');
      // console.log("pathname.split('/').length =", pathname.split("/").length);
      if ((pathname === '') || (pathname.split('/').length > 1)) {
        // empty path or more then one subfolder
        console.log('empty path or more then one subfolder');
        res.statusCode = 400;
        res.end('subfolders und empty path are not supported');
      } else {
        // only one subfolder
        // fs.readdir(path[, options], callback) can be used if file extention is absent in request
        console.log('case get only one subfolder');
        const readFileStream = fs.createReadStream(filepath);
        console.log('filepath =', filepath);
        readFileStream.pipe(res);
        // if smth happened du file manipulations
        readFileStream.on('error', (error) => {
          console.log('error.code =', error.code);
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('file not found');
          } else {
            res.statusCode = 500;
            res.end('something goes wrong');
          }
        });
        // readFileStream.pipe(res);
        // if lost connection
        req.on("aborted", () => {
          readFileStream.destroy();
        });
        // res.end('GET ok');  
      }

      // res.end('GET');
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
    break;
  }
});

module.exports = server;
