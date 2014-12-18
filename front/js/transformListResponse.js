export default function(response) {
    var list = [];

    _.forEach(response, (item) => {
        let newItem = _.clone(item);

        delete newItem.results;
        _.forEach(item.results, (result, index) => {
            newItem.id = newItem.id + '-' + index;

            _.assign(newItem, result);
        });

        list.push(newItem);
    });

    return list;
}
