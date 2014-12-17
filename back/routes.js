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
    app.use('/results', serveIndex(`${__dirname}/../../../results`));
    app.use('/results', express.static(`${__dirname}/../../../results`));
    app.use('/screenshots', serveIndex(`${__dirname}/../../../screenshots`));
    app.use('/screenshots', express.static(`${__dirname}/../../../screenshots`));
    app.use('/failures', serveIndex(`${__dirname}/../../../failures`));
    app.use('/failures', express.static(`${__dirname}/../../../failures`));

    // /
    app.get("/", handlers.home);

    // /api/*
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
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
