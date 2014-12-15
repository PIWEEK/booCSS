var express = require("express");
var app = express();
var serveIndex = require('serve-index')
var Convert = require('ansi-to-html');
var buffspawn = require('buffered-spawn');

var convert = new Convert();
convert.opts.newline = true;

console.log(__dirname + '/../../results');

app.use('/results', serveIndex(__dirname + '/../../results'));
app.use('/results', express.static(__dirname + '/../../results'));
app.use('/screenshots', serveIndex(__dirname + '/../../screenshots'));
app.use('/screenshots', express.static(__dirname + '/../../screenshots'));
app.use('/failures', serveIndex(__dirname + '/../../failures'));
app.use('/failures', express.static(__dirname + '/../../failures'));

app.get("/", function (req, res) {
    res.send("Hello World!")
})

app.get("/test", function (req, res) {
    console.log("launching");
    buffspawn('casperjs', ['test', 'tests/testsuite.js'])
    .progress(function (buff) {
        console.log("progress: ", buff.toString());
    })
    .spread(function (stdout, stderr) {
        // Both stdout and stderr are set with the buffered output, even on failure
        res.send(convert.toHtml(stdout, stderr));
    }, function (err) {
        // Besides err.status there's also err.stdout & err.stderr
        res.send('Command failed with error code of #'  + err.status);
    });
})

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
})
