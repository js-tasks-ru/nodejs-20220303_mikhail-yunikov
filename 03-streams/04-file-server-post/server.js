/*
const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
*/
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if ((pathname === "") || (pathname.split("/").length > 1)) {
        console.log('subfolders und empty path are not supported');
        // Вложенные папки не поддерживаются, при запросе вида `/dir1/dir2/filename` - ошибка `400`.
        res.statusCode = 400;
        res.end('subfolders und empty path are not supported');

      } else {
        if (fs.existsSync(filepath)) {
          // Если файл уже есть на диске - сервер должен вернуть ошибку `409`
          console.log('fs.exists');
          res.statusCode = 409;
          res.end('file already exists');
        } else {
          // writing file to the server HDD
          console.log('fs.doesnt exists');
          limitSizeTransformStream = new LimitSizeStream({limit: 1000000});
          const writeFileStream = fs.createWriteStream(filepath);
          req.pipe(limitSizeTransformStream).pipe(writeFileStream);
          //req.pipe(writeFileStream);
          
          limitSizeTransformStream.on('error', () => {
            // - Максимальный размер загружаемого файла не должен превышать 1МБ, при превышении лимита - ошибка `413`.
            console.log('error limitSizeTransformStream');
            //destroy file and write stream in case of error du transform stream
            writeFileStream.destroy();
            fs.unlink(filepath, function(err) {
              if(err && err.code == 'ENOENT') {
                  // file doens't exist
                  console.log("File doesn't exist, won't remove it.");
              } else if (err) {
                  // other errors, e.g. maybe we don't have enough permission
                  console.log("Error occurred while trying to remove file");
              } else {
                  console.log(`file removed`);
              }
              //res.end('file was not uploaded- connection error');
            });
            res.statusCode = 413;
            res.end('file size limit exceeded');
          });

          req.on('end', () => {
            console.log('file uploaded');
            res.statusCode = 201;
            res.end('file uploaded');
          });

          // if lost connection
          // - Если в процессе загрузки файла на сервер произошел обрыв соединения — созданный файл с диска надо удалять.
          req.on("aborted", () => {
            console.log('server aborted');
            writeFileStream.destroy();
            fs.unlink(filepath, function(err) {
              if(err && err.code == 'ENOENT') {
                  // file doens't exist
                  console.log("File doesn't exist, won't remove it.");
              } else if (err) {
                  // other errors, e.g. maybe we don't have enough permission
                  console.log("Error occurred while trying to remove file");
              } else {
                  console.log(`file removed`);
              }
              //res.end('file was not uploaded- connection error');
            });
          });
          writeFileStream.on('open', () => console.log('writeFileStream opened'));
          writeFileStream.on('close', () => console.log('writeFileStream closed'));
          limitSizeTransformStream.on('open', () => console.log('limitSizeTransformStream opened'));
          limitSizeTransformStream.on('close', () => console.log('limitSizeTransformStream closed'));

        }
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
      break;
  }
  
});

module.exports = server;

