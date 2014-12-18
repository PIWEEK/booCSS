require("6to5/polyfill");


// Imports
import * as express from "express";
import * as serveIndex from 'serve-index';
import {TESTS_PATH,
            SCREENSHOTS_OK_FOLDER_PATH,
            SCREENSHOTS_PENDING_FOLDER_PATH,
            SCREENSHOTS_DIFF_FOLDER_PATH} from './settings';


/************************************/
/* Routes Setup
/************************************/
export function routesSetup(app, handlers){

    // /api/*
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        res.header('Content-Type', 'application/json');

        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    // /api/tests
    app.get("/api/tests", handlers.tests.list);
    app.post("/api/tests", handlers.tests.create);
    app.get("/api/tests/:id", handlers.tests.view);
    app.patch("/api/tests/:id", handlers.tests.update);
    app.delete("/api/tests/:id", handlers.tests.delete);
    app.post('/api/tests/:id/launch', handlers.tests.launch);
}
