require('6to5/polyfill');


// Imports
import * as NeDB from 'nedb';

// Constants
const DB_PATH = `${__dirname}/../../../db/booCSS.db`;


/************************************/
/* DB resources
/************************************/
export default {
    tests: new NeDB({filename: DB_PATH, autoload: true})
};
