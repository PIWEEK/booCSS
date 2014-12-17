import {ListModeButton} from './listModeButton';
import {List} from './list';
import {ListImages} from './listImages';
import {ListActions} from './listActions';

var Link = window.ReactRouter.Link;

export var Tests = React.createClass({
    getInitialState: function() {
        var defaultState = {
            'mode': 'list',
            'filter': false
        };

        var state = defaultState;

        if (localStorage.state) {
            state = JSON.parse(localStorage.state);
        }

        localStorage.state = JSON.stringify(state);

        return state;
    },
    setMode: function(mode) {
        var state = {mode: mode, filter: this.state.filter};

        localStorage.state = JSON.stringify(state);

        this.setState(state);
    },
    toggleFilter: function() {
        var state = {mode: this.state.mode, filter: !this.state.filter};

        localStorage.state = JSON.stringify(state);

        this.setState(state);
    },
    render: function() {
        var list;

        var tests = this.props.tests;

        if (this.state.filter) {
            tests = _.filter(tests, {'status': false});
        }

        if (this.state.mode === 'list') {
            list = <List tests={tests} />
        } else {
            list = <ListImages tests={tests} />
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
               <ListActions toggleFilter={this.toggleFilter} filter={this.state.filter} />
            </div>
        );
  }
});
