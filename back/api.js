require("6to5/polyfill");

var serveIndex = require('serve-index');
var Convert = require('ansi-to-html');
var convert = new Convert();
convert.opts.newline = true;

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var buffspawn = require("buffered-spawn");

import {db as db} from "./db"


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
 * API: /tests
 *********************************/

// list
app.get("/api/tests", (req, res) => {
    var tests = db.tests.find({}, (err, docs) => {
        console.log("LIST: ", docs);
        res.send(docs);
    });
});

// create
app.post("/api/tests", (req, res) => {
    var test = db.tests.insert(req.body, (err, doc) => {
        console.log("CREATE: ", doc);
        res.send(doc);
    });
});

// view
app.get("/api/tests/:id", (req, res) => {
    var test = db.tests.find({_id: req.param.id});
    console.log("VIEW: ", test);
    res.send(test);
});

// update
//app.patch("/api/tests/:id", (req, res) => {
//    var test = db.tests.find({_id: req.param.id});
//    res.send(test);
//});
//

// delete
app.delete("/api/tests/:id", (req, res) => {
    var test = db.tests.remove({_id: req.param.id});
    console.log("DELETE: ", test);
    res.send(test);
});

// post - launch
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
