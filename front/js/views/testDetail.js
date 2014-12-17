var Link = window.ReactRouter.Link;

var TestHeader =  React.createClass({
    render: function () {
        var test = this.props.test;

        return (
            <div className="test-header">
                <Link to="main" title="Return" className="btn btn-fab btn-fab-mini btn-raised btn-primary go-back"><i className="mdi-navigation-arrow-back"></i></Link>

                <h1>{test.name}</h1>

                <div>
                    <button title="Launch" className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
                    <button title="Delete" className="btn btn-fab btn-fab-mini btn-raised btn-danger delete"><i className="mdi-action-delete"></i></button>
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
                            <img src={test.original} />
                        </div>
                        <div className="new image">
                            <img src={test.original} />
                        </div>
                        <div className="diff image">
                            <img src={test.diff} />
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
                        <img src={test.original} />
                    </div>
                </div>
            </div>
        );
    }
});

var TestDetail = React.createClass({
    mixins: [window.ReactRouter.State],
    render: function() {
        var routeParams = this.getParams();
        var testId = parseInt(routeParams.testId, 10);
        var test = _.find(this.props.tests, {id: testId});

        var detail;

        if (test.status) {
            detail = <TestDetailSuccess test={test} />
        } else {
            var failed = _.filter(this.props.tests, {status: false});
            var testIndex = _.findIndex(failed, {id: testId});

            var nextTestIndex = testIndex + 1;
            var nextTest;

            if (failed[nextTestIndex]) {
                nextTest = failed[nextTestIndex];
            } else if (testIndex !== 0) {
                nextTest = failed[0];
            }

            detail = <TestDetailFail test={test} nextTest={nextTest} />
        }

        return (
            <div>
                {detail}
            </div>
        );
  }
});

export {TestDetail};
