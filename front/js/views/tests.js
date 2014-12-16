import {ListModeButton} from './listModeButton';
import {List} from './list';

var Tests = React.createClass({
    getInitialState: function() {
        return {
            mode: 'list',
            tests: [
                {
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013'
                },
                {
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005'
                },
                {
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010'
                }
            ]
        };
    },
    setMode: function(mode) {
        this.setState({mode: mode});
    },
    render: function() {
        var list = <List tests={this.state.tests} />

        return (
            <div>
                <ListModeButton mode={this.state.mode} onClick={this.setMode} />
                {list}
            </div>
        );
  }
});

export {Tests};
