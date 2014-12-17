import {ListModeButton} from './listModeButton';
import {List} from './list';
import {ListImages} from './listImages';
import {ListActions} from './listActions';
import {NewButton} from './newButton';

var Tests = React.createClass({
    getInitialState: function() {
        return {
            mode: 'list'
        }
    },
    setMode: function(mode) {
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
                    <NewButton />
                </div>
               {list}
               <ListActions />
            </div>
        );
  }
});

export {Tests};
