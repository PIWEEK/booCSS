export var ListModeButton = React.createClass({
    imagesMode: function(event) {
        this.props.onClick('image');
    },
    listMode: function(event) {
        this.props.onClick('list');
    },
    render: function() {
        var defaultButton = 'btn-default';
        var primaryButton = 'btn-primary';
        var buttonClasses = ['btn',
                             'btn-raised'];
        var classes = {};

        classes.listButtonClass = _.clone(buttonClasses);
        classes.imageButtonClass = _.clone(buttonClasses);

        if (this.props.mode === 'list') {
            classes.listButtonClass.push(primaryButton);
            classes.imageButtonClass.push(defaultButton);
        } else {
            classes.listButtonClass.push(defaultButton);
            classes.imageButtonClass.push(primaryButton);
        }

        classes.listButtonClass = classes.listButtonClass.join(' ');
        classes.imageButtonClass = classes.imageButtonClass.join(' ');

        return (
                <div className="list-actions">
                    <button className={classes.imageButtonClass} onClick={this.imagesMode}>Images</button>
                    <button className={classes.listButtonClass} onClick={this.listMode}>List</button>
                </div>
        );
    }
});
