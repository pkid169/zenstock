Template.addStock.events({
	'submit form': function(e) {
		e.preventDefault();

		var stock = {
			symbol: $(e.target).find('[name=symbol]').val(),
			portfolioId: Session.get('activePortfolioId')
		};

		if (stock.symbol) {
			Meteor.call('addStock', stock, function(error, result) {
				if (error) {
					return alert(error.reason);
				} else {
					// reset add stock field
					$(e.target).find('[name=symbol]').val('');
				}
			});
		} else {
			alert('Stock Symbol cannot be empty');
		}

		Router.go('portfoliosList');
	}
});