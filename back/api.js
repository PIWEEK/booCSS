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
var path = require('path');

var fs = require('fs-extra')
var replace = require("replace");
var gm = require('gm');

import {db as db} from "./db"


// Constants
const TESTS_PATH = __dirname + "/../../../tests";
const BASE_TEST_FILE = __dirname + "/../../../tests/base.js";

// Serving static content
app.use('/screenshots_ok', serveIndex(__dirname + '/../../../screenshots_ok'));
app.use('/screenshots_ok', express.static(__dirname + '/../../../screenshots_ok'));
app.use('/screenshots_pending', serveIndex(__dirname + '/../../../screenshots_pending'));
app.use('/screenshots_pending', express.static(__dirname + '/../../../screenshots_pending'));
app.use('/screenshots_diff', serveIndex(__dirname + '/../../../screenshots_diff'));
app.use('/screenshots_diff', express.static(__dirname + '/../../../screenshots_diff'));


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
        var writeStream = fs.createWriteStream(outputFile);
        fs.createReadStream(BASE_TEST_FILE).pipe(writeStream);
        writeStream.on('close', function(){
            replace({
                regex: 'TEST_URL',
                replacement: doc.url,
                paths: [outputFile]
            });
        })

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
         var lastExecutionDate = new Date();
         var output = "";
         var results = []
         var calculatedOutput = false;
         var calculatedResults = false;

         var returnIfLaunchIsFinished = () => {
             if (calculatedOutput && calculatedResults) {
                 db.tests.update({_id: doc._id}, {$set: {lastExecutionDate: lastExecutionDate, output: output,  results: results}}, {}, (err, numReplaced) => {
                     db.tests.findOne({_id: doc._id}, (err, updatedDoc) => {
                         res.send(updatedDoc);
                     });
                 });
             }
         }

         var addOutput = (addingOutput) => {
             output = addingOutput;
             calculatedOutput = true;
             returnIfLaunchIsFinished();
         }

         var addResults = (addingResults) => {
             console.log("ADDRESULTS", addingResults);
            results = addingResults;
            calculatedResults = true;
            returnIfLaunchIsFinished();
         }

         //TODO: settings
         var outputDir = 'output';
         var outputFilePath = outputDir+path.sep+doc._id;
         if (fs.existsSync(outputFilePath)){
             fs.removeSync(outputFilePath);
         }

         var watcher = fs.watch(outputDir, function(event, who) {
             if (event === 'rename' && who === doc._id) {
                 console.log("EVENT");
                 watcher.close();
                 var screenshotCreatedPaths = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));
                 var results = [];

                 var addResult = (result) => {
                     console.log("PUSHING RESULT", result);
                     results.push(result);
                     console.log("RESULTs", results);
                     if (results.length == screenshotCreatedPaths.length){
                         console.log("UPDATEEEEEEEEEEEEEE");
                         console.log("ADDRESULTS11111", results);
                         addResults(results);
                         fs.unlinkSync(outputFilePath);
                     }
                 }

                 //The file contain a json with an array of screenshot paths
                 for (let screenshotCreatedPath of screenshotCreatedPaths) {
                     console.log("screenshotCreatedPath", screenshotCreatedPath)
                     var screenshotFileName = screenshotCreatedPath.split(path.sep).slice(-1)[0];
                     console.log(screenshotFileName);
                     //TODO: settings screenshot
                     var screenshotOkPath = 'screenshots_ok'+path.sep+screenshotFileName;
                     var result = {
                         error: false,
                         screenshot_ok: screenshotOkPath
                     }
                     //If there is no valid version for this screenshot then this is the valid version
                     if (! fs.existsSync(screenshotOkPath)) {
                         fs.createReadStream(screenshotCreatedPath).pipe(fs.createWriteStream(screenshotOkPath));
                         console.log("---------------------------------------------")
                         console.log("addResult", result)
                         addResult(result);
                     }else{
                         //A new screenshot and an existing one, let's compare them!
                         var screenshotsDiffPath = 'screenshots_diff'+path.sep+screenshotFileName;
                         var options = {
                             file: screenshotsDiffPath,
                             highlightColor: 'yellow',
                             tolerance: 0.02
                         }

                         gm.compare(screenshotOkPath, screenshotCreatedPath, options, (err, isEqual, equality, raw, path1, path2) => {
                             //The new screenshot is different from the reference
                             if(!isEqual){
                                 result['screenshot_ok'] = path1;
                                 result['screenshot_ko'] = path2;
                                 result['screenshot_diff'] = screenshotsDiffPath;
                                 result['error'] = true;
                             }
                             else {
                                 result['screenshot_ok'] = path1;
                             }
                             console.log("---------------------------------------------")
                             console.log("addResult", result)
                             addResult(result);
                         })
                     }
                 }
             }
         });

         buffspawn('casperjs', ['test', doc.file, '--testId='+doc._id, '--outputFile='+outputFilePath, '--screenshotsFolder=screenshots_pending'])
         .progress((buff) => {
             console.log("Progress: ", buff.toString());
         })
         .spread((stdout, stderr) => {
             // Both stdout and stderr are set with the buffered output, even on failure
             var spreadOutput = convert.toHtml(stdout, stderr);
             addOutput(spreadOutput);
         }, (err) => {
             // Besides err.status there's also err.stdout & err.stderr
             var errOutput = convert.toHtml(err.stdout, err.stderr);
             addOutput(errOutput);
         });
     });
});

//TODO: settings output, screenshots_ok, screenshots_diff
if (fs.existsSync('output')){
    fs.removeSync('output');
    fs.mkdirSync('output');
}

if (!fs.existsSync('screenshots_ok')){
    fs.mkdirSync('screenshots_ok');
}

if (!fs.existsSync('screenshots_diff')){
    fs.mkdirSync('screenshots_diff');
}


/*********************************
 * Run Server
 *********************************/
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("API listening at http://%s:%s", host, port);
});
