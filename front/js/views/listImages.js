export var ListImages = React.createClass({
    render: function() {
        var tests = this.props.tests.map(function (test) {
            var status = test.status ? 'status ok' : 'status fail';

            var resolve = '';

            if (!test.status) {
                resolve = <button title="Resolve" className="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success"><i className="mdi-navigation-check"></i></button>
            }

            return (
                <div className="test-item-image">
                    <div className="image-wrapper">
                        <img src={test.image} />
                        <div className="actions">
                             <div>
                                 {resolve}
                                 <button title="Launch" className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
                             </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className={status}></div>
                        <div className="content">
                            <h2>{test.name}</h2>
                            <p className="date">{test.date}</p>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="test-image-list">
                {tests}
            </div>
        );
    }
});
