require("6to5/polyfill");

var express = require("express");
var livereload = require('connect-livereload');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(livereload());

var serveIndex = require('serve-index');
var Convert = require('ansi-to-html');
var convert = new Convert();
convert.opts.newline = true;

var buffspawn = require("buffered-spawn");
var chokidar = require('chokidar');
var fs = require('fs');
var path = require('path');

var fs = require("fs");

import {db as db} from "./db"


// Constants
const TESTS_PATH = __dirname + "/../../../tests";
const BASE_TEST_FILE = __dirname + "/../../../tests/base.js";

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
    db.tests.find({}, (err, docs) => {
        console.log("LIST: ", docs);
        res.send(docs);
    });
});

// create
app.post("/api/tests", (req, res) => {
    console.log(req.body);
    db.tests.insert(req.body, (err, doc) => {
        //TODO: error control (db and file creation)
        var outputFile = `${TESTS_PATH}/test_${doc._id}.js`;
        fs.createReadStream(BASE_TEST_FILE).pipe(fs.createWriteStream(outputFile));

        db.tests.update({_id: doc._id}, {$set: {file: outputFile}}, {multi: false}, (err, numReplaced) => {
            console.log("CREATE: ", doc);
            res.send(doc);
        });
    });
});

// view
app.get("/api/tests/:id", (req, res) => {
    db.tests.findOne({_id: req.param("id")}, (err, doc) => {
        //TODO: error control, actually response is empty if id is not valid
        console.log("VIEW: ", doc);
        res.send(doc);
    });
});

// update
app.patch("/api/tests/:id", (req, res) => {
    //TODO: error control
    db.tests.update({_id: req.param("id")}, { $set: req.body }, {}, (err, numReplaced) => {
        db.tests.findOne({_id: req.param("id")}, (err, doc) => {
            res.send(doc);
        });
    });
});

// delete
app.delete("/api/tests/:id", (req, res) => {
    //TODO: error control, actually response is empty if id is not valid
    db.tests.remove({_id: req.param("id")}, (err, numDocRemoved) => {
        res.send({});
    });
});

// post - launch
 app.post('/api/tests/:id/launch', (req, res) => {
     db.tests.findOne({_id: req.param("id")}, (err, doc) => {
         var lastExecutionDate = new Date()
         buffspawn('casperjs', ['test', doc.file, '--testId='+doc._id])
         .progress((buff) => {
             console.log("Progress: ", buff.toString());
         })
         .spread((stdout, stderr) => {
             // Both stdout and stderr are set with the buffered output, even on failure
             var output = convert.toHtml(stdout, stderr);
             db.tests.update({_id: doc._id}, {$set: {output: output,  lastExecutionDate: lastExecutionDate}}, {}, (err, numReplaced) => {
                 db.tests.findOne({_id: doc._id}, (err, updatedDoc) => {
                     res.send(updatedDoc);
                 });
             });
         }, (err) => {
             // Besides err.status there's also err.stdout & err.stderr
             var output = convert.toHtml(err.stdout, err.stderr);
             db.tests.update({_id: doc._id}, {$set: {output: output, lastExecutionDate: lastExecutionDate}}, {}, (err, numReplaced) => {
                 db.tests.findOne({_id: doc._id}, (err, updatedDoc) => {
                     res.send(updatedDoc);
                 });
             });
         });
     });
});

var watcher = chokidar.watch('output');
watcher
    .on('ready', function() {
        console.info('Initial scan complete. Ready for changes.')
        watcher.on('add', function(filePath) {
            console.log('File', filePath, 'has been added');
            var testResult = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var testId = filePath.split(path.sep)[1];
            db.tests.update({_id: testId}, {$set: {'result': testResult}}, {});
            fs.unlinkSync(filePath);
        })
})

/*********************************
 * Run Server
 *********************************/
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("API listening at http://%s:%s", host, port);
});
