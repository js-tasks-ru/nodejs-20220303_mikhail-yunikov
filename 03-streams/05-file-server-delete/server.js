const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if ((pathname === "") || (pathname.split("/").length > 1)) {
        console.log('subfolders und empty path are not supported');
        // Вложенные папки не поддерживаются, при запросе вида `/dir1/dir2/filename` - ошибка `400`.
        res.statusCode = 400;
        res.end('subfolders und empty path are not supported');
      } else {
        if (fs.existsSync(filepath)) {
          // check if file exists
          console.log('fs exists and will be deleted');
          fs.unlink(filepath, function(err) {
            if (err) {
              // other errors, e.g. maybe we don't have enough permission
              // no need to check if file exists or not
              console.log("Error occurred while trying to remove file");
              res.statusCode = 500;
              res.end('error during file operation');
          } else {
            // При успешном удалении сервер должен вернуть ответ со статусом `200`
            console.log(`file removed`);
            res.statusCode = 200;
            res.end('file has been deleted');
          }
                //res.end('file was not uploaded- connection error');
              });
        } else {
          // file doesnt exist
          console.log("File doesn't exist, won't remove it.");
          res.statusCode = 404;
          res.end('File doesnt exist');
        }
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
      break;
  }

  req.on('error', () => {
    console.log('unknown error');
    res.statusCode = 500;
    res.end('unknown error');
  });

});

module.exports = server;
