var fs = require('fs');
var testId = casper.cli.options.testId;
var outputFile = casper.cli.options.outputFile;
var screenshotsFolder = casper.cli.options.screenshotsFolder;
var screenshots = []

casper.start( 'TEST_URL' );
casper.viewport(1024, 768);

casper.then(function() {
	capturePath = screenshotsFolder+fs.separator+ testId+'_1.png'
	casper.captureSelector(capturePath, 'html');
	screenshots.push(capturePath);
});

casper.run(function(){
	fs.write(outputFile, JSON.stringify(screenshots), 'w')
	this.exit();
});
