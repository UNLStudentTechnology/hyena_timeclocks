var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.all("/*", function(req, res, next) {
    res.sendfile("index.html", { root: __dirname + "/dist" });
});
app.listen(process.env.PORT || 5000);