require("6to5/polyfill");


// Imports
import * as express from 'express';
import * as validator from 'express-validator';
import * as livereload from 'connect-livereload';
import * as bodyParser from 'body-parser';

import handlers from './handlers';
import {routesSetup} from './routes';

// Constants
const PORT = 3000;


/************************************/
/* Server Setup
/************************************/
var app = express();
app.use(livereload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

routesSetup(app, handlers);

var server = app.listen(PORT, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`API listening at http://${host}:${port}`);
});
