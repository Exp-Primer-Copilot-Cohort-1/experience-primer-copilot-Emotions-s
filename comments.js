// create web server
const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const mime = require("mime");
const comments = [];

http
  .createServer(function (req, res) {
    // parse url
    let pathname = url.parse(req.url).pathname;
    // get real file path
    let realPath = "assets" + pathname;

    // get file's suffix
    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : "unknown";
    // read file
    fs.exists(realPath, function (exists) {
      if (!exists) {
        res.writeHead(404, {
          "Content-Type": "text/plain",
        });
        res.write(
          "This request URL " + pathname + " was not found on this server."
        );
        res.end();
      } else {
        fs.readFile(realPath, "binary", function (err, file) {
          if (err) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end(err);
          } else {
            let contentType = mime.lookup(ext);
            res.writeHead(200, {
              "Content-Type": contentType,
            });
            res.write(file, "binary");
            res.end();
          }
        });
      }
    });
    // handle post
    if (req.method === "POST") {
      let body = "";
      req.setEncoding("utf8");
      req.on("data", function (chunk) {
        body += chunk;
      });
      req.on("end", function () {
        let obj = JSON.parse(body);
        comments.push(obj);
        res.end("ok");
      });
    } else if (req.method === "GET") {
      if (pathname === "/comment") {
        let query = url.parse(req.url, true).query;
        if (query.callback) {
          let str = query.callback + "(" + JSON.stringify(comments) + ")";
          res.end(str);
        } else {
          res.end(JSON.stringify(comments));
        }
      }
    }
  })
  .listen(3000, function () {
    console.log("Server is running at http://localhost:3000/");
  });
