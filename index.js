const http = require("http");
const fs = require("fs");
const client = http.createServer((req, res) => {
  // get the request url
  const url = req.url;

  // welcome page if default route
  if (url === "/") {
    res.write(
      "<html><body>Welcome to the home page! This is the main page.<br>"
    );
    res.write("<a href='/create'>Create User</a><br>");
    res.write("<a href='/users'>Users List</a></body></html>");
    res.end();
  }

  // create user page on create route
  if (url === "/create") {
    res.write('<html><body><a href="/">Back</a><br>');
    res.write(
      '<form method="POST" action="/add"><input type="text"name="msg"><input type="submit"></form></body></html>'
    );
    res.end();
  }

  // add user to file if route is add
  if (url === "/add") {
    const chunksData = [];
    req.on("data", (chunks) => {
      chunksData.push(chunks);
    });
    req.on("end", () => {
      const data = Buffer.concat(chunksData).toString();
      fs.appendFile("users.txt", `${data.split("=")[1]}\n`, (err) => {
        if (err) {
          res.end("Error: Failed to append data to the file");
        } else {
          res.end();
        }
      });
    });
    res.writeHead(302, { Location: "/" });
    res.end();
  }

  // show the list of the users on users route
  if (url === "/users") {
    fs.readFile("users.txt", "utf8", (err, data) => {
      if (err) {
        res.write("Error reading the file");
        res.end();
      } else {
        // display users when file has users otherwise redirect to create route
        if (data) {
          res.write(data);
          res.end();
        } else {
          res.writeHead(302, { Location: "/create" });
          res.end();
        }
      }
    });
  }
});
client.listen(3000);
