var phantomcss = require('./phantomcss.js');

phantomcss.init({
	screenshotRoot: './screenshots',
	failedComparisonsRoot: './failures',
	comparisonResultRoot: './results',
	addLabelToFailedImage: false,
	onFail: function(test){
		// We have a new screenshot but there is no change
		console.log("- FAIL", test.filename);
		console.log(" failing file:",  test.diffFile);
		console.log(" diff file:", test.failFile);
		console.log(test.mismatch);
	},
	onPass: function(test){
		// We have screenshot but there is no change
		console.log("- PASS", test.filename);
	},
	onNewImage: function(test){
		// We still have no screenshot
		console.log("NEW IMAGE", test.filename);
	},
	outputSettings: {
		errorColor: {
			red: 255,
			green: 255,
			blue: 0
		},
		errorType: 'movement',
		transparency: 0.3
	},
	onComplete: function(allTests, noOfFails, noOfErrors){
		allTests.forEach(function(test){
			if(test.fail){
				console.log("onComplete", test.filename, test.failFile, test.mismatch);
			}
		});
		console.log("FINISHED!");
	},
});

casper.start( 'http://kaleidos.net/asd' );
casper.viewport(1024, 768);
casper.then(function(){
	phantomcss.screenshot('#content', 'main content');
});

casper.then( function now_check_the_screenshots(){
	phantomcss.compareAll();
});

casper.run(function(){
	phantom.exit(phantomcss.getExitStatus());
});
