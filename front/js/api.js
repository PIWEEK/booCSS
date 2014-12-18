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
    }
};
