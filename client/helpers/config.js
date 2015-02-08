Tracker.autorun(function() {
	if (Meteor.user()) {

	} else {
		Router.go('/');
	}
});