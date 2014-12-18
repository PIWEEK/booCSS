var Link = window.ReactRouter.Link;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


function isScrolledIntoView(elm) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elmTop = $(elm).offset().top;

    return elmTop <= docViewBottom;
}

function checkVisibles() {
    $('.test-item-image img').each(function() {
        if(isScrolledIntoView(this)) {
            $(this).fadeIn();
        } else {
            $(this).hide();
        }
    });
}


export var ListImages = React.createClass({
    componentDidMount: function() {
        requestAnimationFrame(() => {
            checkVisibles();
        });

        $(window).on('scroll', () => {
            checkVisibles();
        });
    },
    componentWillReceiveProps: function() {
        requestAnimationFrame(() => {
            checkVisibles();
        });
    },
    componentWillUnmount: function() {
        $(window).off('scroll');
    },
    render: function() {
        var tests = this.props.tests.map(function (test) {
            var status = test.error ? 'status fail' : 'status ok btn-material-success';

            var resolve = '';

            if (test.error) {
                resolve = <button title="Resolve" className="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success"><i className="mdi-navigation-check"></i></button>
            }

            return (
                <div className="test-item-image">
                    <div className="image-wrapper">
                        <img src={test.image} />
                        <div className="actions">
                             <div>
                                 {resolve}
                                 <button title="Launch" className="btn btn-fab btn-fab-mini btn-raised btn-material-deeporange"><i className="mdi-navigation-refresh"></i></button>
                             </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className={status}></div>
                        <div className="content">
                            <h2><Link to="test" params={{testId: test._id}}>{test.name}</Link></h2>
                            <p className="date">{test.date}</p>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="test-image-list">
                {tests}
            </div>
        );
    }
});
