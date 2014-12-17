var Link = window.ReactRouter.Link;

var NewForm = React.createClass({
    componentDidMount: function() {
        $.material.init();
    },
    submit: function() {
        console.log("submit");
    },
    render: function() {
        return (
            <div className="new-form">
            <form onSubmit={this.submit}>
                <h1>New test</h1>
                <div className="form-group">
                    <input required className="form-control" placeholder="Title" type="text" />
                </div>
                <div className="form-group">
                    <input required className="form-control" placeholder="URL" type="text" />
                </div>
                <div className="form-group">
                    <textarea className="form-control" placeholder="Description"></textarea>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-raised">Create</button>
                    <Link to="main" title="Cancel" className="btn btn-default btn-raised">Cancel</Link>
                </div>
            </form>
            </div>
        );
  }
});

export {NewForm};
