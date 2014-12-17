require('6to5/polyfill');


// Imports
import db from './db'
import {TestLauncher} from './launcher'
import * as fs from 'fs-extra';
import * as replace from 'replace';

// Constants
const TESTS_PATH = `${__dirname}/../../../tests`;
const BASE_TEST_FILE = `${__dirname}/../../../tests/base.js`;

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
            //TODO: configure screenshots_pending
            //TODO: configure settings
            //TODO: settings screenshot folders
            var test =  new TestLauncher(doc._id, doc.file, 'output', 'screenshots_pending', 'screenshots_ok', 'screenshots_diff');
            test.launch().then((updatedData) => {
                db.tests.update({_id: doc._id}, {$set: updatedData}, {});
                doc.results = updatedData.results;
                doc.output = updatedData.output;
                doc.lastExecutionDate = updatedData.lastExecutionDate;
                res.send(doc);
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
