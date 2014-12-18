import api from './api';

var TestActions = {
    launch: (test) => {
        return api.launchTest(test.testId, test.index);
    },
    delete: (test) => {
        return api.deleteTest(test.testId);
    },
    resolve: (test) => {
        return api.resolveTest(test.testId, test.index);
    }
}

export {TestActions};
