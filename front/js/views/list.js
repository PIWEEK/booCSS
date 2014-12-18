import {TestActions} from '../common';

var Link = window.ReactRouter.Link;

var Item = React.createClass({
    mixins: [TestActions, window.ReactRouter.Navigation],
    launchClass: 'mdi-navigation-refresh',
    resolveClass: 'mdi-navigation-check',
    getInitialState: function() {
        return {
            launchClass: this.launchClass,
            resolveClass: this.resolveClass
        }
    },
    handleLaunch: _.debounce(function(test) {
        this.state.launchClass = this.launchClass + ' glyphicon-refresh-animate';
        this.setState(this.state);

        this.launch(test).done(() => {
            this.props.onChange();
        });
    }, 2000, {leading: true, trailing: false}),
    handleResolve: _.debounce(function(test) {
        this.state.resolveClass = 'mdi-navigation-refresh glyphicon-refresh-animate';
        this.setState(this.state);

        this.resolve(test).done(() => {
            this.props.onChange();
        });
    }, 2000, {leading: true, trailing: false}),
    componentWillReceiveProps: function() {
        this.setState({
            launchClass: this.launchClass,
            resolveClass: this.resolveClass
        });
    },
    render: function() {
        var test = this.props.test;
        var status = test.error ? 'status fail' : 'status ok btn-material-success';

        var resolve = '';

        if (test.error) {
            resolve = <button title="Resolve" onClick={this.handleResolve.bind(null, test)} className="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success"><i className={this.state.resolveClass}></i></button>
        }

        return (
        <div className="test-item">
            <div className={status}></div>
            <div className="wrap">
                <div className="content">
                    <h2><Link to="test" params={{testId: test._id}}>{test.name}</Link></h2>
                    <p className="date">{test.lastExecutionDate}</p>
                </div>
                <div className="actions">
                    {resolve}
                    <button title="Launch" onClick={this.handleLaunch.bind(null, test)} className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange btn-launch">
                        <i className={this.state.launchClass}></i>
                    </button>
                </div>
            </div>
        </div>
        );
    }
});

export var List = React.createClass({
    render: function() {
        var tests = this.props.tests.map(function (test) {
            return (
                <Item test={test} onChange={this.props.onChange} />
            );
        }, this);

        return (
            <div className="test-list">
                {tests}
            </div>
        );
    }
});
