Meteor.methods({
	addStock: function(stockAttributes) {

		var user = Meteor.user();
		var stock = _.extend(stockAttributes, {
			userId: user._id,
			currentPrice: 0,
			positionQuantity: 0,
			positionPrice: 0,
			currentChange: 0,
			currentChangePercentage: 0,
			capital: 0,
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
		Transactions.remove({stockId: stockId});
	},
	getStockCurrentPrice: function(stockId, stockSymbol) {
		Meteor.http.get("http://finance.google.com/finance/info?client=ig&q=" + stockSymbol, function (err, res) {
			var respContent = res.content.replace("// ", "");
			var respStock = JSON.parse(respContent)[0];
			var newPrice = respStock.l;
			var newChange = respStock.c;
			var newChangePercentage = respStock.cp;

			var newStockProperties = {
				currentPrice: newPrice,
				currentChange: newChange,
				currentChangePercentage: newChangePercentage
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
});