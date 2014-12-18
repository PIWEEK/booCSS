require('6to5/polyfill');

// Imports
import * as fs from 'fs-extra';
import * as path from 'path';

function mkdirIfNotExist(path){
    if (!fs.existsSync(path)){
        fs.mkdir(path);
    }
}

// Constants
export const TESTS_PATH = path.normalize(path.join(__dirname,'..','..','..','tests'));
mkdirIfNotExist(TESTS_PATH);
export const BASE_TEST_FILE = path.normalize(path.join(__dirname,'..','..','..','test_base.js'));

export const CASPER_OUTPUT_FOLDER_PATH = path.normalize(path.join(__dirname,'..','..','..','output'));
mkdirIfNotExist(CASPER_OUTPUT_FOLDER_PATH);
export const SCREENSHOTS_OK_FOLDER_PATH = path.normalize(path.join(__dirname,'..','..','images', 'screenshots_ok'));
mkdirIfNotExist(SCREENSHOTS_OK_FOLDER_PATH);
export const SCREENSHOTS_PENDING_FOLDER_PATH = path.normalize(path.join(__dirname,'..','..','images', 'screenshots_pending'));
mkdirIfNotExist(SCREENSHOTS_PENDING_FOLDER_PATH);
export const SCREENSHOTS_DIFF_FOLDER_PATH = path.normalize(path.join(__dirname,'..','..','images', 'screenshots_diff'));
mkdirIfNotExist(SCREENSHOTS_DIFF_FOLDER_PATH);

export const DB_PATH = path.join(__dirname,'..','..','..','db/booCSS.db');
