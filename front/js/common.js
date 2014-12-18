import api from './api';

var TestActions = {
    launch: function(test) {
        return api.launchTest(test.testId, test.index);
    },
    delete: function(test) {
        api.deleteTest(test.testId);
    }
}


export {TestActions};
