var phantomcss = require('./../phantomcss.js');

phantomcss.init({
	screenshotRoot: './screenshots',
	failedComparisonsRoot: './failures',
	comparisonResultRoot: './results',
	addLabelToFailedImage: false,
	onFail: function(test){
		console.log("- FAIL", test.filename, test.failFile, test.mismatch);
	},
	onPass: function(test){
		console.log("- PASS", test.filename);
	},
	onNewImage: function(test){
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

casper.start( 'http://kaleidos.net/' );
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
