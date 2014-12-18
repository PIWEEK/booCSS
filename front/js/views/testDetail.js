import api from '../api';
import transformResponse from '../transformListResponse';
import {TestActions} from '../common';

var Link = window.ReactRouter.Link;

var TestHeader =  React.createClass({
    mixins: [TestActions],
    componentDidMount: function() {
        $.material.init();
    },
    render: function () {
        var test = this.props.test;

        return (
            <div className="test-header">
                <Link to="main" title="Return" className="btn btn-fab btn-fab-mini btn-raised btn-primary go-back"><i className="mdi-navigation-arrow-back"></i></Link>

                <h1>{test.name}</h1>

                <div>
                    <button title="Launch" onClick={this.launch.bind(null, test)} className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
                    <button title="Delete" data-toggle="modal" data-target="#delete-dialog" className="btn btn-fab btn-fab-mini btn-raised btn-danger delete"><i className="mdi-action-delete"></i></button>
                </div>
            </div>
        );
    }
});

var TestDetailFail = React.createClass({
    render: function() {
        var test = this.props.test;

        var nextButton;

        if (this.props.nextTest) {
            nextButton = (
                <Link to="test" params={{testId: this.props.nextTest.id}} className="btn btn-raised btn-warning">
                    <i className="mdi-av-skip-next"></i>
                </Link>
            );
        }
        return (
            <div className="test-detail test-detail-fail">
                <div className="inner">
                    <TestHeader test={test} />
                    <div className="select-buttons">
                        <div className="wrap">
                            <button className="btn btn-raised btn-success">
                                <i className="mdi-navigation-check"></i>
                            </button>
                            {nextButton}
                        </div>
                    </div>
                    <div className="images">
                        <div className="original image">
                            <img src={test.screenshot_ok} />
                        </div>
                        <div className="new image">
                            <img src={test.screenshot_ko} />
                        </div>
                        <div className="diff image">
                            <img src={test.screenshot_diff} />
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
                    <TestHeader test={test} />
                    <div className="image">
                        <img src={test.screenshot_ok} />
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
        console.log("deleteTest", test);
        api.deleteTest(test.testId).then(() => {
            this.transitionTo('main');
        });
    },
    componentDidMount: function() {
        api.getTests().done((response) => {
            if (this.isMounted()) {
                this.setState({tests: transformResponse(response)});
            }
        });
    },
    render: function() {
        var routeParams = this.getParams();
        var testId = routeParams.testId;
        console.log(testId);
        var test = _.find(this.state.tests, {_id: testId});
        console.log(test);
        var detail;

        if (test) {
            if (!test.error) {
                detail = <TestDetailSuccess test={test} />
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

                detail = <TestDetailFail test={test} nextTest={nextTest} />
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
            </div>
        );
  }
});

export {TestDetail};
