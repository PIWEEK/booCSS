import {ListModeButton} from './listModeButton';
import {List} from './list';
import {ListImages} from './listImages';

var Tests = React.createClass({
    getInitialState: function() {
        return {
            mode: 'list',
            tests: [
                {
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png'
                },
                {
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407'
                },
                {
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png'
                },
                {
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407'
                },
                {
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png'
                },
                {
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407'
                }
            ]
        };
    },
    setMode: function(mode) {
        this.setState({mode: mode});
    },
    render: function() {
        var list;

        if (this.state.mode === 'list') {
            list = <List tests={this.state.tests} />
        } else {
            list = <ListImages tests={this.state.tests} />
        }

        return (
            <div>
               <ListModeButton mode={this.state.mode} onClick={this.setMode} />
               {list}
            </div>
        );
  }
});

export {Tests};
