require('6to5/polyfill');


// Imports
import * as NeDB from 'nedb';
import {DB_PATH} from './settings';


/************************************/
/* DB resources
/************************************/
export default {
    tests: new NeDB({filename: DB_PATH, autoload: true})
};
