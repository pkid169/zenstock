Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('stocks'); }
});

Router.route('/', {name: 'stocksList'});

Router.route('/add', {name: 'addStock'});