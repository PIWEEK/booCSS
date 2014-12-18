require('6to5/polyfill');

// Imports
import * as fs from 'fs-extra';

function mkdirIfNotExist(path){
    if (!fs.existsSync(path)){
        fs.mkdir(path);
    }
}

// Constants
export const TESTS_PATH = `${__dirname}/../../../tests`;
mkdirIfNotExist(TESTS_PATH);
export const BASE_TEST_FILE = `${__dirname}/../../../test_base.js`;

export const CASPER_OUTPUT_FOLDER_PATH = `${__dirname}/../../../output`;
mkdirIfNotExist(CASPER_OUTPUT_FOLDER_PATH);
export const SCREENSHOTS_OK_FOLDER_PATH = `${__dirname}/../../images/screenshots_ok`;
mkdirIfNotExist(SCREENSHOTS_OK_FOLDER_PATH);
export const SCREENSHOTS_PENDING_FOLDER_PATH = `${__dirname}/../../images/screenshots_pending`;
mkdirIfNotExist(SCREENSHOTS_PENDING_FOLDER_PATH);
export const SCREENSHOTS_DIFF_FOLDER_PATH = `${__dirname}/../../images/screenshots_diff`;
mkdirIfNotExist(SCREENSHOTS_DIFF_FOLDER_PATH);

export const DB_PATH = `${__dirname}/../../../db/booCSS.db`;
