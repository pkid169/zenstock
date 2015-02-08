Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('stocks'); }
});

Router.route('/', {name: 'stocksList'});

Router.route('/add', {name: 'addStock'});

var requireLogin = function() {
	if (!Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeAction(requireLogin, {only: 'addStock'});