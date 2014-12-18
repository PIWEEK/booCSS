import {TestActions} from '../common';

export var ListActions = React.createClass({
    mixins: [TestActions],
    resolveAllClass: 'mdi-navigation-check',
    getInitialState: function() {
        return {
            resolveAllClass: this.resolveAllClass
        }
    },
    handleResolveAll: _.debounce(function() {
        this.state.resolveAllClass = 'mdi-navigation-refresh glyphicon-refresh-animate';
        this.setState(this.state);

        this.resolveAll().done(() => {
            this.props.onChange();
        });
    }, 2000, {leading: true, trailing: false}),
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
                    <button onClick={this.handleResolveAll.bind(null)} className="btn btn-material-teal btn-raised">Check All</button>
                    {button}
                </div>
            </div>
        );
    }
});
