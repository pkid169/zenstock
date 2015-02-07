Template.addStock.events({
	'submit form': function(e) {
		e.preventDefault();

		var stock = {
			symbol: $(e.target).find('[name=symbol]').val(),
			buyPrice: $(e.target).find('[name=buyPrice]').val(),
			buyQuantity: $(e.target).find('[name=buyQuantity]').val(),
			currentPrice: 0,
			sellPrice: 0,
			sellQuantity: 0
		};

		Meteor.call('addStock', stock, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				var stockId = result._id;
				var stockSymbol = stock.symbol;
				getStockCurrentPrice(stockId, stockSymbol);
			}
		});

		Router.go('stocksList');
	}
});