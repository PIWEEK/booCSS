require('6to5/polyfill');

// Imports
import * as Convert from 'ansi-to-html';
import * as buffspawn from 'buffered-spawn';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as gm from 'gm';

// Vars
var convert = new Convert({newline: true});

export class TestLauncher {
    constructor(testId, testFilePath, outputDirPath, screenshotsOkFolder, screenshotsPendingFolder, screenshotsDiffFolder) {
        this.lastExecutionDate = new Date();
        this.testId = testId;
        this.testFilePath = testFilePath;
        this.outputDirPath = outputDirPath;
        this.outputFilePath = outputDirPath+path.sep+testId;
        this.screenshotsOkFolder = screenshotsOkFolder;
        this. screenshotsPendingFolder = screenshotsPendingFolder;
        this.screenshotsDiffFolder = screenshotsDiffFolder;
    }

    launch() {
        var promise = new Promise((resolve, reject) => {
            // we have two different processes here. One for executing the casper command ang reading the output and one for reading the output file
            var casperOutputReader = new CasperOutputReader(this.testId, this.outputDirPath, this.outputFilePath, this.screenshotsOkFolder, this.screenshotsDiffFolder);
            var casperLauncher = new CasperLauncher(this.testId, this.testFilePath, this.outputFilePath, this.screenshotsPendingFolder, this.screenshotsDiffFolder);
            var promiseCasperOutputReader = casperOutputReader.read();
            var promiseCasperLauncher = casperLauncher.launch();

            Promise.all([promiseCasperOutputReader, promiseCasperLauncher]).then((result) => {
                resolve( {results: result[0], output: result[1], lastExecutionDate: this.lastExecutionDate});
            });
        });
        return promise;
    }
}

// In charge of launching the casperjs command for executing the tests and receiving the output
class CasperLauncher {
    constructor(testId, testFilePath, outputFilePath, screenshotsPendingFolder){
        this.testId = testId;
        this.testFilePath = testFilePath;
        this.outputFilePath = outputFilePath;
        if (fs.existsSync(outputFilePath)){
            fs.removeSync(outputFilePath);
        }
        this. screenshotsPendingFolder = screenshotsPendingFolder;
    }

    launch(){
        var promise = new Promise((resolve, reject) => {
            buffspawn('casperjs', ['test', this.testFilePath, '--testId='+this.testId, '--outputFile='+this.outputFilePath, '--screenshotsFolder='+this.screenshotsPendingFolder])
            .progress((buff) => { console.log("Progress: ", buff.toString());})
            .spread((stdout, stderr) => {
                resolve(convert.toHtml(stdout, stderr));
            }, (err) => {
                resolve(convert.toHtml(err.stdout, err.stderr));
            });
        });
        return promise;
    }
}

// In charge of reading the output file with the testing results when it's generated
class CasperOutputReader {
    constructor(testId, outputDirPath, outputFilePath, screenshotsOkFolder, screenshotsDiffFolder) {
        this.testId = testId;
        this.outputDirPath = outputDirPath;
        this.outputFilePath = outputFilePath;
        this.screenshotsOkFolder = screenshotsOkFolder;
        this.screenshotsDiffFolder = screenshotsDiffFolder
    }
    read() {
        var promise = new Promise((resolve, reject) => {
            var watcher = fs.watch(this.outputDirPath, (event, who) => {
                if (event === 'rename' && who === this.testId) {
                    watcher.close();
                    var screenshotCreatedPaths = JSON.parse(fs.readFileSync(this.outputFilePath, 'utf8'));
                    var resultPromises = [];
                    //The file contain a json with an array of screenshot paths
                    for (let screenshotCreatedPath of screenshotCreatedPaths) {
                        var resultPromise = this.createResultPromise(screenshotCreatedPath);
                        resultPromises.push(resultPromise);
                    }

                    Promise.all(resultPromises).then((results) => {
                        fs.unlinkSync(this.outputFilePath);
                        resolve(results);
                    });
                }
            });
        });
        return promise;
    }

    createResultPromise(screenshotCreatedPath) {
        var screenshotFileName = screenshotCreatedPath.split(path.sep).slice(-1)[0];
        var screenshotOkPath = this.screenshotsOkFolder+path.sep+screenshotFileName;
        var promise = new Promise((resolve, reject) => {
            //If there is no valid version for this screenshot then this is the valid version
            if (! fs.existsSync(screenshotOkPath)) {
                fs.createReadStream(screenshotCreatedPath).pipe(fs.createWriteStream(screenshotOkPath));
                resolve({
                    error: false,
                    screenshot_ok: screenshotOkPath.split(this.screenshotsOkFolder)[1]
                });
            }else{
                //A new screenshot and an existing one, let's compare them!
                var screenshotsDiffPath = this.screenshotsDiffFolder+path.sep+screenshotFileName;
                var options = { file: screenshotsDiffPath, highlightColor: 'yellow', tolerance: 0.02 }
                gm.compare(screenshotOkPath, screenshotCreatedPath, options, (err, isEqual, equality, raw, path1, path2) => {
                    //The new screenshot is different from the reference
                    var result = {}
                    if(!isEqual){
                        result = {
                            error: true,
                            screenshot_ok: path1.split(this.screenshotsOkFolder)[1],
                            screenshot_ko: path2.split(this.screenshotsPendingFolder)[1],
                            screenshot_diff:  screenshotsDiffPath.split(this.screenshotsDiffFolder)[1]
                        }
                    }
                    else {
                        result = {
                            error: false,
                            screenshot_ok: path1.split(this.screenshotsOkFolder)[1]
                        }
                    }
                    resolve(result);
                })
            }
        });
        return promise;
    }
}
