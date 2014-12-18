export default function(response) {
    var list = [];

    _.forEach(response, (item) => {
        let newItem = _.clone(item);

        delete newItem.results;
        _.forEach(item.results, (result, index) => {
            newItem.testId = newItem._id;
            newItem.index = index;

            newItem._id = newItem._id + '-' + index;

            newItem.getScreenshotOk = function() {
                let date = new Date().getTime();

                return newItem.screenshot_ok + '?timestamp=' + date;
            };

            newItem.getScreenshotKo = function() {
                let date = new Date().getTime();

                return newItem.screenshot_ko + '?timestamp=' + date;
            };

            newItem.getScreenshotDiff = function() {
                let date = new Date().getTime();

                return newItem.screenshot_diff + '?timestamp=' + date;
            };

            _.assign(newItem, result);
        });

        list.push(newItem);
    });

    return list;
}
