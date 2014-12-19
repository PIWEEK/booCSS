import api from '../api';
import transformResponse from '../transformListResponse';
import {TestActions} from '../common';

var Link = window.ReactRouter.Link;

var TestHeader =  React.createClass({
    mixins: [TestActions],
    launchClass: 'mdi-navigation-refresh',
    getInitialState: function() {
        return {launchClass: this.launchClass}
    },
    componentDidMount: function() {
        $.material.init();
    },
    componentWillReceiveProps: function() {
        this.setState({launchClass: this.launchClass});
    },
    handleLaunch: _.debounce(function(test) {
        this.state.launchClass = this.launchClass + ' glyphicon-refresh-animate';
        this.setState(this.state);

        this.launch(test).done(() => {
            this.props.onChange();
        });
    }, 2000, {leading: true, trailing: false}),
    render: function () {
        var test = this.props.test;

        return (
            <div className="test-header">
                <Link to="main" title="Return" className="btn btn-fab btn-fab-mini btn-raised btn-primary go-back"><i className="mdi-navigation-arrow-back"></i></Link>

                <h1>{test.name}</h1>

                <div>
                    <button title="Info" data-toggle="modal" data-target="#info-dialog" className="btn btn-fab btn-fab-mini btn-raised btn-info info"><i className="mdi-action-info"></i></button>
                    <button title="Launch" onClick={this.handleLaunch.bind(null, test)} className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className={this.state.launchClass}></i></button>
                    <button title="Delete" data-toggle="modal" data-target="#delete-dialog" className="btn btn-fab btn-fab-mini btn-raised btn-danger delete"><i className="mdi-action-delete"></i></button>
                </div>
            </div>
        );
    }
});

var TestDetailFail = React.createClass({
    mixins: [TestActions],
    resolveClass: 'mdi-navigation-check',
    getInitialState: function() {
        return {resolveClass: this.resolveClass}
    },
    componentWillReceiveProps: function() {
        this.setState({resolveClass: this.resolveClass});
    },
    handleResolve: _.debounce(function(test) {
        this.state.resolveClass = 'mdi-navigation-refresh glyphicon-refresh-animate';
        this.setState(this.state);

        this.resolve(test).done(() => {
            this.props.onChange();
        });
    }, 2000, {leading: true, trailing: false}),
    render: function() {
        var test = this.props.test;

        var nextButton;

        if (this.props.nextTest) {
            nextButton = (
                <Link to="test" params={{testId: this.props.nextTest._id}} className="btn btn-raised btn-warning">
                    <i className="mdi-av-skip-next"></i>
                </Link>
            );
        }
        return (
            <div className="test-detail test-detail-fail">
                <div className="inner">
                    <TestHeader onChange={this.props.onChange} test={test} />
                    <div className="select-buttons">
                        <div className="wrap">
                            <button onClick={this.handleResolve.bind(null, test)} className="btn btn-raised btn-success">
                                <i className={this.state.resolveClass}></i>
                            </button>
                            {nextButton}
                        </div>
                    </div>
                    <div className="images">
                        <div className="original image">
                            <img src={test.getScreenshotOk()} />
                        </div>
                        <div className="new image">
                            <img src={test.getScreenshotKo()} />
                        </div>
                        <div className="diff image">
                            <img src={test.getScreenshotDiff()} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var TestDetailSuccess = React.createClass({
    render: function() {
        var test = this.props.test;

        return (
            <div className="test-detail test-detail-success">
                <div className="inner">
                    <TestHeader onChange={this.props.onChange} test={test} />
                    <div className="image">
                        <img src={test.getScreenshotOk()} />
                    </div>
                </div>
            </div>
        );
    }
});

var TestDetail = React.createClass({
    mixins: [window.ReactRouter.State, window.ReactRouter.Navigation],
    getInitialState: function() {
        return {
            tests: []
        }
    },
    deleteTest: function(test) {
        api.deleteTest(test.testId).then(() => {
            $('#delete-dialog').modal('hide');
            this.transitionTo('main');
        });
    },
    closeInfoDialog: function(test){
        $('#info-dialog').modal('hide');
    },
    loadTests: function() {
        api.getTests().done((response) => {
            if (this.isMounted()) {
                this.setState({tests: transformResponse(response)});
            }
        });
    },
    componentDidMount: function() {
        this.loadTests();
    },
    onChange: function() {
        this.loadTests();
    },
    render: function() {
        var routeParams = this.getParams();
        var testId = routeParams.testId;
        var test = _.find(this.state.tests, {_id: testId});
        var detail;
        var output;

        if (test) {
            output = test.output;
            if (!test.error) {
                detail = <TestDetailSuccess test={test} onChange={this.onChange} />
            } else {
                var failed = _.filter(this.state.tests, {error: true});
                var testIndex = _.findIndex(failed, {_id: testId});

                var nextTestIndex = testIndex + 1;
                var nextTest;

                if (failed[nextTestIndex]) {
                    nextTest = failed[nextTestIndex];
                } else if (testIndex !== 0) {
                    nextTest = failed[0];
                }

                detail = <TestDetailFail test={test} onChange={this.onChange} nextTest={nextTest} />
            }
        }

        return (
            <div>
                {detail}
                <div id="delete-dialog" className="delete-dialog modal fade" tabindex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h2>Are you sure?</h2>
                                <div className="options">
                                    <button onClick={this.deleteTest.bind(null, test)} className="btn btn-primary btn-flat">
                                        <i className="mdi-navigation-check"></i> Ok
                                    </button>
                                    <button data-dismiss="modal" className="btn btn-default btn-flat">
                                        <i className="mdi-navigation-close"></i> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="info-dialog" className="info-dialog modal fade" tabindex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h2>Test debug info</h2>
                                <div dangerouslySetInnerHTML={{__html: output}}/>
                                <div className="options">
                                    <button onClick={this.closeInfoDialog.bind(null, test)} className="btn btn-primary btn-flat">
                                        <i className="mdi-navigation-check"></i> Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
  }
});

export {TestDetail};
