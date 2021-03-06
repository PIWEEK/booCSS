import {ListModeButton} from './listModeButton';
import {List} from './list';
import {ListImages} from './listImages';
import {ListActions} from './listActions';
import api from '../api';
import transformResponse from '../transformListResponse';

var Link = window.ReactRouter.Link;

export var Tests = React.createClass({
    getInitialState: function() {
        var defaultState = {
            'mode': 'list',
            'filter': false,
            'tests': []
        };

        var state = defaultState;

        if (localStorage.list) {
            var listOptions = JSON.parse(localStorage.list);

            state.filter = listOptions.filter ? listOptions.filter : state.filter;
            state.mode = listOptions.mode ? listOptions.mode : state.mode;
        }

        return state;
    },
    loadTests: function() {
        api.getTests().done((response) => {
            if (this.isMounted()) {
                this.setState({mode: this.state.mode, filter: this.state.filter, tests: transformResponse(response)});
            }
        });
    },
    componentDidMount: function() {
        this.loadTests();
    },
    setMode: function(mode) {
        var list = {mode: mode, filter: this.state.filter};

        localStorage.list = JSON.stringify(list);

        var state = {mode: list.mode, filter: list.filter, tests: this.state.tests};

        this.setState(state);
    },
    checkAll: function() {
        var tests = _.filter(tests, {'error': true});

    },
    toggleFilter: function() {
        var list = {mode: this.state.mode, filter: !this.state.filter};

        localStorage.list = JSON.stringify(list);

        var state = {mode: list.mode, filter: list.filter, tests: this.state.tests};

        this.setState(state);
    },
    onChange: function() {
        this.loadTests();
    },
    render: function() {
        var list;

        var tests = this.state.tests;

        if (this.state.filter) {
            tests = _.filter(tests, {'error': true});
        }

        if (this.state.mode === 'list') {
            list = <List tests={tests} onChange={this.onChange} />
        } else {
            list = <ListImages tests={tests} onChange={this.onChange} />
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
               <ListActions onChange={this.onChange} toggleFilter={this.toggleFilter} filter={this.state.filter} />
            </div>
        );
  }
});
