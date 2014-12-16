require("6to5/polyfill");

var serveIndex = require('serve-index');
var Convert = require('ansi-to-html');
var convert = new Convert();
convert.opts.newline = true;

var express = require("express");
var app = express();

var buffspawn = require("buffered-spawn");

// Serving static content
app.use('/results', serveIndex(__dirname + '/../../../results'));
app.use('/results', express.static(__dirname + '/../../../results'));
app.use('/screenshots', serveIndex(__dirname + '/../../../screenshots'));
app.use('/screenshots', express.static(__dirname + '/../../../screenshots'));
app.use('/failures', serveIndex(__dirname + '/../../../failures'));
app.use('/failures', express.static(__dirname + '/../../../failures'));

/*********************************
 * API: /
 *********************************/
app.get("/", (req, res) => {
    res.send("Hello World!")
});


/*********************************
 * API: /test
 *********************************/

 app.post('/api/tests/:testFile/launch', (req, res) => {
    var testFile = req.param("testFile");
    buffspawn('casperjs', ['test', testFile]).progress((buff) => {
        console.log("Progress: ", buff.toString());
    })
    .spread((stdout, stderr) => {
        // Both stdout and stderr are set with the buffered output, even on failure
        res.send(convert.toHtml(stdout, stderr));
    }, (err) => {
        // Besides err.status there's also err.stdout & err.stderr
        res.send(convert.toHtml(err.stdout, err.stderr));
    });
});


/*********************************
 * Run Server
 *********************************/
app.use(require('connect-livereload')());
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("API listening at http://%s:%s", host, port);
});
