const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = 8765;
const baseDir = path.resolve(__dirname, "screens");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const normalized = requestPath === "/" ? "01-auth-form.png" : requestPath.replace(/^\/+/, "");
  const filePath = path.resolve(baseDir, normalized);

  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("not found");
      return;
    }

    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`);
});
