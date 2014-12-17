import {Tests} from './views/tests';
import {TestDetail} from './views/testDetail';

var Router = window.ReactRouter;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({
    getInitialState: function() {
        return {
            tests: [
                {
                    'id': 2,
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 3,
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 4,
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 5,
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 6,
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 7,
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 8,
                    'name': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2013',
                    'image': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 9,
                    'name': 'Maecenas blandit laoreet massa vitae porttitor',
                    'status': true,
                    'description': 'blablabla',
                    'date': '11/12/2005',
                    'image': 'http://upload.wikimedia.org/wikipedia/commons/c/ca/Ubuntu_GNOME_13.10_ScreenShot.png',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                },
                {
                    'id': 10,
                    'name': 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
                    'status': false,
                    'description': 'blablabla',
                    'date': '11/12/2010',
                    'image': 'http://i1-news.softpedia-static.com/images/news2/Ubuntu-GNOME-13-10-Alpha-2-Saucy-Salamander-Officially-Released-Screenshot-Tour-371212-6.jpg?1374825407',
                    'original': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'new': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg',
                    'diff': 'http://imagenes.es.sftcdn.net/es/scrn/70000/70565/ubuntu-79-700x525.jpg'
                }
            ]
        };
    },
    render: function () {
        return (
            <RouteHandler tests={this.state.tests} />
        );
    }
});

var routes = (
  <Route handler={App} path="/">
    <Route name="test" path="/test/:testId" handler={TestDetail}/>
    <Route name="main" path="/" handler={Tests}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
});
