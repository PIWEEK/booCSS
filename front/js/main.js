import {Tests} from './views/tests';
import {TestDetail} from './views/testDetail';
import {NewForm} from './views/newForm';
import api from './api';

var Router = window.ReactRouter;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({
    getInitialState: function() {
        return {
            tests: []
        };
    },
    getTests: function() {
        api.getTests().done((response) => {
            this.setState({tests: response});
        });
    },
    componentDidMount: function() {
        this.getTests();
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
    <Route name="new" path="/new" handler={NewForm}/>
    <Route name="main" path="/" handler={Tests}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
});
