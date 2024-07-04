// nơi import thư viện
var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');
var mysql = require('mysql');
var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// connect
var con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root123",
    insecureAuth: true,
    database: "csdl_project"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!!")
    var sql = "select * from nhietdo_data;";
    con.query(sql, function (err, results) {
        if (err) throw err;
        console.log(results);
    })
});
//viết api
app.get("/get", function (req, res) {
    var sql = "SELECT * FROM nhietdo_data ORDER BY id  DESC LIMIT 1";
    con.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
})

app.post("/post", function (req, res) {
    const { temperature, humidity, times } = req.body
    var sql = "insert into nhietdo_data(temperature,humidity,times) values(" + temperature + ", " + humidity + ",'" + times + "' )";
    con.query(sql, function (err, results) {
        if (err) throw err;
        res.send(" them thanh cong");
    });
})
// server đang chạy ở cổng
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server is listening at http://%s:%s", host, port)
})