import {ListModeButton} from './listModeButton';
import {List} from './list';
import {ListImages} from './listImages';
import {ListActions} from './listActions';

var Link = window.ReactRouter.Link;

var Tests = React.createClass({
    getInitialState: function() {
        var mode = localStorage.mode ? localStorage.mode : 'list';

        localStorage.mode = mode;

        return {
            'mode': mode
        }
    },
    setMode: function(mode) {
        localStorage.mode = mode;

        this.setState({mode: mode});
    },
    render: function() {
        var list;

        if (this.state.mode === 'list') {
            list = <List tests={this.props.tests} />
        } else {
            list = <ListImages tests={this.props.tests} />
        }

        return (
            <div className="tests">
                <div className="top-tests-list">
                    <ListModeButton mode={this.state.mode} onClick={this.setMode} />
                    <Link to="new" title="New" className="btn btn-fab btn-fab-mini btn-raised btn-primary">
                        <i className="mdi-content-add"></i>
                    </Link>
                </div>
               {list}
               <ListActions />
            </div>
        );
  }
});

export {Tests};
