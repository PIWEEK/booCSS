import {Tests} from './views/tests';

var Router = window.ReactRouter;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({
  render: function () {
    return (
       <RouteHandler/>
    );
  }
});

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Tests} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
});
