var Link = window.ReactRouter.Link;

var TestDetailFail = React.createClass({
    render: function() {
        var test = this.props.test;
        return (
            <div className="test-detail test-detail-fail">
                <div className="inner">
                    <div className="select-buttons">
                        <div className="wrap">
                            <button className="btn btn-raised btn-success">Ok</button>
                            <button className="btn btn-raised btn-warning">No</button>
                        </div>
                    </div>
                    <Link to="main" title="Return" className="btn btn-fab btn-fab-mini btn-raised btn-primary go-back"><i className="mdi-navigation-arrow-back"></i></Link>
                    <button title="Delete" className="btn btn-fab btn-fab-mini btn-raised btn-danger delete"><i className="mdi-action-delete"></i></button>
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
                    <Link to="main" title="Return" className="btn btn-fab btn-fab-mini btn-raised btn-primary go-back"><i className="mdi-navigation-arrow-back"></i></Link>
                    <button title="Delete" className="btn btn-fab btn-fab-mini btn-raised btn-danger delete"><i className="mdi-action-delete"></i></button>
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
            detail = <TestDetailFail test={test} />
        }

        return (
            <div>
            {detail}
            </div>
        );
  }
});

export {TestDetail};
