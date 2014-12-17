require('6to5/polyfill');


// Imports
import * as Convert from 'ansi-to-html';
import * as buffspawn from 'buffered-spawn';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs';
import * as replace from 'replace';
import db from './db'

// Constants
const TESTS_PATH = `${__dirname}/../../../tests`;
const BASE_TEST_FILE = `__dirname}/../../../tests/base.js`;

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
            res.send(docs);
        });
    },
    create: (req, res) => {
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
            });

            db.tests.update({_id: doc._id}, {$set: {file: outputFile}}, {multi: false}, (err, numReplaced) => {
                console.log('CREATE: ', doc);
                res.send(doc);
            });
        });
    },
    view: (req, res) => {
        db.tests.findOne({_id: req.param('id')}, (err, doc) => {
            //TODO: error control, actually response is empty if id is not valid
            console.log('VIEW: ', doc);
            res.send(doc);
        });
    },
    update: (req, res) => {
        //TODO: error control
        db.tests.update({_id: req.param('id')}, { $set: req.body }, {}, (err, numReplaced) => {
            db.tests.findOne({_id: req.param('id')}, (err, doc) => {
                res.send(doc);
            });
        });
    },
    delete: (req, res) => {
        //TODO: error control, actually response is empty if id is not valid
        db.tests.remove({_id: req.param('id')}, (err, numDocRemoved) => {
            res.send({});
        });
    },
    launch: (req, res) => {
        db.tests.findOne({_id: req.param('id')}, (err, doc) => {
            var lastExecutionDate = new Date()
            buffspawn('casperjs', ['test', doc.file, '--testId='+doc._id])
            .progress((buff) => {
                console.log('Progress: ', buff.toString());
            })
            .spread((stdout, stderr) => {
                // Both stdout and stderr are set with the buffered output, even on failure
                var output = convert.toHtml(stdout, stderr);
                db.tests.update({_id: doc._id}, {$set: {output: output, lastExecutionDate: lastExecutionDate}}, {}, (err, numReplaced) => {
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

            var expectedOutputFilePath = 'output'+path.sep+doc._id;
            var watcher = chokidar.watch('output', {ignoreInitial: true});
            watcher.on('add', function(filePath) {
                console.log('File', filePath, 'has been added');
                if (expectedOutputFilePath == filePath) {
                    watcher.close();
                    var testResult = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    var testId = filePath.split(path.sep)[1];
                    db.tests.update({_id: testId}, {$set: {'result': testResult}}, {});
                    fs.unlinkSync(filePath);
                }
            })
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
