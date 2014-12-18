require('6to5/polyfill');


// Imports
import db from './db'
import {TestLauncher} from './launcher'
import * as fs from 'fs-extra';
import * as replace from 'replace';
import {TESTS_PATH,
            BASE_TEST_FILE,
            CASPER_OUTPUT_FOLDER_PATH,
            SCREENSHOTS_OK_FOLDER_PATH,
            SCREENSHOTS_PENDING_FOLDER_PATH,
            SCREENSHOTS_DIFF_FOLDER_PATH} from './settings';

// Utils functions
function resolveTest(doc, index, callback) {
   console.log("--CACA-- ", doc._id, index, doc.results[index].error);
   var diff_file = doc.results[index].screenshot_diff.split("/").slice(-1)[0];
   var ok_file = doc.results[index].screenshot_ok.split("/").slice(-1)[0];
   var ko_file = doc.results[index].screenshot_ko.split("/").slice(-1)[0];

   var diff_path = `${SCREENSHOTS_DIFF_FOLDER_PATH}/${diff_file}`;
   var ok_path = `${SCREENSHOTS_OK_FOLDER_PATH}/${ok_file}`;
   var ko_path = `${SCREENSHOTS_PENDING_FOLDER_PATH}/${ko_file}`;

   if(!fs.existsSync(ok_path)) {
       callback(true, doc);
   }
   if(!fs.existsSync(ko_path)) {
       callback(true, doc);
   }
   if(!fs.existsSync(diff_path)) {
       callback(true, doc);
   }

   fs.remove(ok_path);
   fs.remove(diff_path);
   fs.copy(ko_path, ok_path);

   doc.results[index].error = false;
   doc.results[index].screenshot_diff = "";

   db.tests.update({_id: doc._id}, {$set: doc}, {});

   callback(false, doc);
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
            var test =  new TestLauncher(doc._id, outputFile, CASPER_OUTPUT_FOLDER_PATH, SCREENSHOTS_OK_FOLDER_PATH, SCREENSHOTS_PENDING_FOLDER_PATH, SCREENSHOTS_DIFF_FOLDER_PATH);
            test.launch().then((updatedData) => {
                updatedData.file = outputFile;
                db.tests.update({_id: doc._id}, {$set: updatedData});
                doc.results = updatedData.results;
                doc.output = updatedData.output;
                doc.file = outputFile
                doc.lastExecutionDate = updatedData.lastExecutionDate;
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
            var test =  new TestLauncher(doc._id, doc.file, CASPER_OUTPUT_FOLDER_PATH, SCREENSHOTS_OK_FOLDER_PATH, SCREENSHOTS_PENDING_FOLDER_PATH, SCREENSHOTS_DIFF_FOLDER_PATH);
            test.launch().then((updatedData) => {
                db.tests.update({_id: doc._id}, {$set: updatedData}, {});
                doc.results = updatedData.results;
                doc.output = updatedData.output;
                doc.lastExecutionDate = updatedData.lastExecutionDate;
                res.json(doc);
            });
        });
    },
    resolve: (req, res) => {
        req.checkBody("index", "required and must be a number").notEmpty().isInt();

        var errors = req.validationErrors(true);
        if (errors) {
            res.status(400).json(errors).end();
        }
        db.tests.findOne({_id: req.param('id')}, (err, doc) => {
            if(err){
                res.status(404).json(err).end();
            }
            var index = req.body.index;
            console.log('RESOLVE: ', doc.results[index]);

            resolveTest(doc, index, (err, doc) => {
                if(err){
                    res.status(500).json({error: `error resolving test ${doc._id}-${index}`}).end();
                }
                res.json(doc);
            });
        });
    },
    resolveAll: (req, res) => {
        db.tests.find({}, (err, docs) => {
            for(var doc of docs) {
                for(var i = 0; i < doc.results.length; i++) {
                    if (doc.results[i].error){
                        resolveTest(doc, i, (err, doc) => {
                            if(err){
                                res.status(500).json({error: `error resolving test ${doc._id}-${i}`}).end();
                            }
                        });
                    }
                }
            }
            res.status(200).end();
        });
    }
}


/************************************/
/* Exports
/************************************/
export default { tests: tests };
