export var ListActions = React.createClass({
    render: function() {
        var button;

        if (this.props.filter) {
            button = <button onClick={this.props.toggleFilter} className="btn btn-material-deeporange btn-raised">All</button>
        } else {
            button = <button onClick={this.props.toggleFilter} className="btn btn-material-deeppurple btn-raised">Failed</button>
        }

        return (
            <div className="list-actions">
                <div className="wrapper">
                    <button className="btn btn-material-teal btn-raised">Check All</button>
                    {button}
                </div>
            </div>
        );
    }
});
