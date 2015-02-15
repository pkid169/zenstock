Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return [Meteor.subscribe('stocks'), Meteor.subscribe('portfolios')]; }
});

Router.route('/addPortfolio', {name: 'addPortfolio'});

Router.route('/', {name: 'portfoliosList'})
Router.route('/stocksList', {name: 'stocksList'});

Router.route('/add', {name: 'addStock'});

Router.route('/transact/:_id', {
	name: 'addTransaction',
	data: function() { return Stocks.findOne(this.params._id); }
});

var requireLogin = function() {
	if (!Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeAction(requireLogin, {only: 'addStock'});