require("6to5/polyfill");

const DB_PATH = __dirname + "/db/booCSS.db"

var NeDB = require('nedb');


export var db = {
    tests: new NeDB({filename: DB_PATH, autoload: true})
};

