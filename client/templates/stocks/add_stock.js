Template.addStock.events({
	'submit form': function(e) {
		e.preventDefault();

		var stock = {
			symbol: $(e.target).find('[name=symbol]').val()
		};

		Meteor.call('addStock', stock, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				var stockId = result._id;
				var stockSymbol = stock.symbol;
				Meteor.call('getStockCurrentPrice', stockId, stockSymbol, function(error, result) {
					if (error) {
						alert(error);
					}
				});
			}
		});

		Router.go('stocksList');
	}
});