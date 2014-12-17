require('6to5/polyfill');


// Imports
import * as Convert from 'ansi-to-html';
import * as buffspawn from 'buffered-spawn';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as replace from 'replace';
import * as gm from 'gm';

import db from './db'

// Constants
const TESTS_PATH = `${__dirname}/../../../tests`;
const BASE_TEST_FILE = `${__dirname}/../../../tests/base.js`;

// Vars
var convert = new Convert({newline: true});


/************************************/
/* HANDLER: Home
/************************************/
var home = (req, res) => {
    res.send('Hello World!')
}


/************************************/
/* HANDLER: Tests
/************************************/
var tests = {

    list: (req, res) => {
        db.tests.find({}, (err, docs) => {
            console.log('LIST: ', docs);
            res.json(docs);
        });
    },

    create: (req, res) => {
        req.checkBody("name", "required").notEmpty()
        req.checkBody("description", "required").notEmpty()
        req.checkBody("url", "required").notEmpty()
        req.checkBody("url", "must be a valid url").isURL()

        var errors = req.validationErrors(true);
        if (errors) {
            res.status(400).json(errors).end();
        }

        db.tests.insert(req.body, (err, doc) => {
            if (err) {
                res.status(400).json(err).end();
            }
            var outputFile = `${TESTS_PATH}/test_${doc._id}.js`;
            var writeStream = fs.createWriteStream(outputFile);
            fs.createReadStream(BASE_TEST_FILE).pipe(writeStream);
            writeStream.on('close', () => {
                replace({
                    regex: 'TEST_URL',
                    replacement: doc.url,
                    paths: [outputFile]
                });
            });

            db.tests.update({_id: doc._id}, {$set: {file: outputFile}}, {multi: false}, (err, numReplaced) => {
                console.log('CREATE: ', doc);
                res.json(doc);
            });
        });
    },

    view: (req, res) => {
        db.tests.findOne({_id: req.param('id')}, (err, doc) => {
            if(err){
                res.status(404).json(err).end();
            }
            console.log('VIEW: ', doc);
            res.json(doc);
        });
    },

    update: (req, res) => {
        req.checkBody("url", "must be a valid url").optional().isURL()

        var errors = req.validationErrors(true);
        if (errors) {
            res.status(400).json(errors).end();
        }

        db.tests.update({_id: req.param('id')}, { $set: req.body }, {}, (err, numReplaced) => {
            if(err){
                res.status(404).json(err).end();
            }
            db.tests.findOne({_id: req.param('id')}, (err, doc) => {
                res.json(doc);
            });
        });
    },

    delete: (req, res) => {
        db.tests.remove({_id: req.param('id')}, (err, numDocRemoved) => {
            if(err){
                res.status(404).json(err).end();
            }
            res.json({});
        });
    },

    launch: (req, res) => {
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
    }
}


/************************************/
/* Exports
/************************************/
export default {
    home: home,
    tests: tests
};
