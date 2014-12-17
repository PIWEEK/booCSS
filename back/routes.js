require("6to5/polyfill");


// Imports
import * as express from "express";
import * as serveIndex from 'serve-index';


/************************************/
/* Routes Setup
/************************************/
export function routesSetup(app, handlers){
    // static
    app.use('/tests', serveIndex(`${__dirname}/../../../tests`));
    app.use('/tests', express.static(`${__dirname}/../../../tests`));
    //TODO: settings for screenshots folders
    //TODO: create if not existing
    app.use('/screenshots_ok', serveIndex(`${__dirname}/../../../screenshots_ok`));
    app.use('/screenshots_ok', express.static(`${__dirname}/../../../screenshots_ok`));
    app.use('/screenshots_pending', serveIndex(`${__dirname}/../../../screenshots_pending`));
    app.use('/screenshots_pending', express.static(`${__dirname}/../../../screenshots_pending`));
    app.use('/screenshots_diff', serveIndex(`${__dirname}/../../../screenshots_diff`));
    app.use('/screenshots_diff', express.static(`${__dirname}/../../../screenshots_diff`));

    // /
    app.get("/", handlers.home);

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
