Stocks = new Mongo.Collection('stocks');

Meteor.methods({
	addStock: function(stockAttributes) {

		var user = Meteor.user();
		var stock = _.extend(stockAttributes, {
			userId: user._id,
			currentPrice: 0,
			sellPrice: 0,
			sellQuantity: 0,
			created: new Date()
		});

		var stockId = Stocks.insert(stock);
		return {
			_id: stockId
		};
	},
	updateStock: function(stockId, stockAttributes) {
		Stocks.update(stockId, {$set: stockAttributes});
	},
	removeStock: function(stockId) {
		Stocks.remove(stockId);
	}
});

getStockCurrentPrice = function(stockId, stockSymbol) {
	Meteor.http.get("http://finance.google.com/finance/info?client=ig&q=" + stockSymbol, function (err, res) {
		var respContent = res.content.replace("// ", "");
		var respStock = JSON.parse(respContent)[0];
		var newPrice = respStock.l;

		var newStockProperties = {
			currentPrice: newPrice
		};

		if (respStock && respStock.l) {
			Meteor.call('updateStock', stockId, newStockProperties, function(error, result) {
				if (error) {
					alert(error.reason);
				}
			});
		}

		console.log(respStock);
	});
}