import api from './api';

var TestActions = {
    launch: function(test) {
        api.launchTest(test.testId, test.index);
    }
}


export {TestActions};
