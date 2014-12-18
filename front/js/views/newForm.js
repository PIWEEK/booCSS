import api from '../api';

var Link = window.ReactRouter.Link;

var NewForm = React.createClass({
    mixins: [window.ReactRouter.Navigation],
    componentDidMount: function() {
        $.material.init();
    },
    submit: _.debounce(function(e) {
        e.preventDefault();

        var test = {};

        test.name = this.refs.name.getDOMNode().value;
        test.url =  this.refs.url.getDOMNode().value;
        test.description =  this.refs.description.getDOMNode().value;

        $(this.getDOMNode())
            .find('.glyphicon-refresh-animate')
            .removeClass('hidden');

        api.createTest(test).done((response) => {
            this.transitionTo('main');
        });
    }, 2000, {leading: true, trailing: false}),
    render: function() {
        return (
            <div className="new-form">
            <form onSubmit={this.submit}>
                <h1>New test</h1>
                <div className="form-group">
                    <input required className="form-control" ref="name" placeholder="Name" type="text" />
                </div>
                <div className="form-group">
                    <input required className="form-control" ref="url" placeholder="URL" type="url" />
                </div>
                <div className="form-group">
                    <textarea required className="form-control" ref="description" placeholder="Description"></textarea>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-raised">
                        <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate hidden"></span> Create
                    </button>
                    <Link to="main" title="Cancel" className="btn btn-default btn-raised">Cancel</Link>
                </div>
            </form>
            </div>
        );
  }
});

export {NewForm};
