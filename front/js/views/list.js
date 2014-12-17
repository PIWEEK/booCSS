var Link = window.ReactRouter.Link;

export var List = React.createClass({
    render: function() {
        var tests = this.props.tests.map(function (test) {
            var status = test.status ? 'status ok btn-material-success' : 'status fail';

            var resolve = '';

            if (!test.status) {
                resolve = <button title="Resolve" className="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success"><i className="mdi-navigation-check"></i></button>
            }

            return (
                <div className="test-item">
                    <div className={status}></div>
                    <div className="wrap">
                        <div className="content">
                            <h2><Link to="test" params={{testId: test.id}}>{test.name}</Link></h2>
                            <p className="date">{test.date}</p>
                        </div>
                        <div className="actions">
                            {resolve}
                            <button title="Launch" className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
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
