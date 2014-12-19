export default function(response) {
    var list = [];

    _.forEach(response, (item) => {
        let newItem = _.clone(item);

        delete newItem.results;

        console.log(item);
        console.log(item.results);
        
        _.forEach(item.results, (result, index) => {
            newItem.testId = newItem._id;
            newItem.index = index;
            console.log(result.screenshot_ok);
            newItem._id = newItem._id + '-' + index;

            newItem.getScreenshotOk = function() {
                if (newItem.screenshot_ok) {
                    let date = new Date().getTime();

                    return newItem.screenshot_ok + '?timestamp=' + date;
                } else {
                    return '/images/no-image.png';
                }
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

        if(item.results){
            list.push(newItem);
        }
    });

    return list;
}
