import {TestActions} from '../common';

var Link = window.ReactRouter.Link;

export var List = React.createClass({
    mixins: [TestActions],
    render: function() {
        var tests = this.props.tests.map(function (test) {
            var status = test.error ? 'status fail' : 'status ok btn-material-success';

            var resolve = '';

            if (test.error) {
                resolve = <button title="Resolve" className="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success"><i className="mdi-navigation-check"></i></button>
            }

            return (
                <div className="test-item">
                    <div className={status}></div>
                    <div className="wrap">
                        <div className="content">
                            <h2><Link to="test" params={{testId: test._id}}>{test.name}</Link></h2>
                            <p className="date">{test.date}</p>
                        </div>
                        <div className="actions">
                            {resolve}
                            <button title="Launch" onClick={this.launch.bind(null, test)} className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="test-list">
                {tests}
            </div>
        );
    }
});
