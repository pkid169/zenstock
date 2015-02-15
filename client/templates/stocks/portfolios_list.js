Template.portfoliosList.helpers({
	portfolios: function() {
		return Portfolios.find();
	},
	isTabSelected: function(portfolioId) {
		return Session.get('activePortfolioId') === portfolioId;
	}
});

Template.portfoliosList.events({
	'click .portfolio-tab': function(e) {
		var selectedPortfolioId = $(e.target).attr('href');

		if (selectedPortfolioId) {
			Session.set('activePortfolioId', selectedPortfolioId.substring(1));	
		}
	},
	'click .remove-portfolio': function(e) {
		var id = $(e.target).parent().parent().attr('href').slice(1);
		var toBeRemovedPortfolio = Portfolios.findOne({_id: id});
		var nextPortfolio = Portfolios.findOne({created: {$gt: toBeRemovedPortfolio.created}});

		var movedToPortfolioId;
		if (nextPortfolio) {
			movedToPortfolioId = nextPortfolio._id;
		} else {
			var prevPortfolio = Portfolios.findOne({created: {$lt: toBeRemovedPortfolio.created}});
			if (prevPortfolio) {
				movedToPortfolioId = prevPortfolio._id;				
			}
		}

		// TODO: add confirmation
		Meteor.call('removePortfolio', id, function(error, result) {
			if (error) {
				alert(error.reason);
			} else {
				if (movedToPortfolioId) {
					Session.set('activePortfolioId', movedToPortfolioId);
					$('.nav-tabs a[href=#'+movedToPortfolioId+']').tab('show');	
				} else {
					Session.set('activePortfolioId', '');
				}
				Router.go('/');
			}
		});
	}
});