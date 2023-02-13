const http = require("node:http");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const url = require("node:url");

//populate request bodynya hehe siuu
const parser = bodyParser.json();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb",
});

const server = http.createServer((req, res) => {
  const METHOD = req.method;
  const URI = req.url;
  //parse url nya ngab biar bisa diambil jdi data hehe siuuu
  const nganu = url.parse(req.url, true);
  const id = nganu.query.id;

  if (METHOD === "GET" && URI === "/api/kegiatan") {
    const query = "SELECT * FROM mydb.todo_list";
    connection.query(query, (err, result) => {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": "application/json" });
      console.log(result);
      res.end(
        JSON.stringify({
          result: result,
        })
      );
    });
  } else if (METHOD === "POST" && URI === "/api/kegiatan") {
    parser(req, res, (error) => {
      if (error) throw error;
      const query = `INSERT INTO mydb.todo_list (kegiatan, status) VALUES ('${req.body.kegiatan}', '${req.body.status}')`;
      connection.query(query, (err) => {
        if (err) throw err;
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "Sukses menambahkan data bosku",
          })
        );
      });
    });
  } else if (METHOD === "DELETE" && URI === `/api/kegiatan?id=${id}`) {
    const query = `DELETE FROM mydb.todo_list WHERE ID = ${id} `;
    connection.query(query, (err) => {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "Sukses menghapus data bosku.",
        })
      );
    });
  } else if (METHOD === "PATCH" && URI === `/api/kegiatan?id=${id}`) {
    parser(req, res, (error) => {
      let columns = "";
      if (error) throw error;
      console.log(req.body);
      const keysBody = Object.keys(req.body);
      for (let key in req.body) {
        if (key === keysBody[keysBody.length - 1]) {
          columns += `${key} = '${req.body[key]}'`;
        } else {
          columns += `${key} = '${req.body[key]}', `;
        }
      }
      const query = `UPDATE mydb.todo_list SET ${columns} WHERE ID = ${id}`;
      connection.query(query, (err) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "Sukses memperbaharui data bosku.",
          })
        );
      });
    });
  }
});

const PORT = 6969;
server.listen(PORT, () => {
  console.log(`🚀 Server running on: ${PORT} ( ͡° ͜ʖ ͡°)`);
});
