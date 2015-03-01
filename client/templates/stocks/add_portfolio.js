Template.addPortfolio.events({
	'submit form': function(e) {
		e.preventDefault();

		var portfolioForm = $(e.target);
		var portfolio = {
			name: portfolioForm.find('[name=name]').val(),
			icon: 'portfolio'
		};

		Meteor.call('addPortfolio', portfolio, function(error, result) {
			if (error) {
				alert(error);
			} else {
				var createdPortfolioId = result._id;
				Session.set('activePortfolioId', createdPortfolioId);
				$('.nav-tabs a[href=#'+createdPortfolioId+']').tab('show');
				$('#add-portfolio-modal').modal('hide');

				// Reset form
				portfolioForm.find('[name=name]').val("");
				portfolioForm.find('[name=icon]').val("");
			}
		});
	}
});