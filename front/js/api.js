var root = "http://0.0.0.0:3000";

var url = '/api/tests';

export default {
    createTest: function(test) {
        return $.post(root + url, test);
    },
    getTests: function() {
        return $.get(root + url);
    },
    launchTest: function(testId, screenIndex) {
        var path = '/:id/launch'.replace(':id', testId);
        return $.post(root + url + path, {'index': screenIndex});
    },
    deleteTest: function(testId) {
        console.log("DELETE", testId);
        var path = '/:id'.replace(':id', testId);
        return $.ajax({url: root + url + path, type: 'DELETE'});
    },
    resolveTest: function(testId, screenIndex) {
        var path = '/:id/resolve'.replace(':id', testId);
        return $.post(root + url + path, {'index': screenIndex});
    },
    resolveAllTests: function() {
        var path = '/resolve';
        return $.post(root + url + path);
    }
};
