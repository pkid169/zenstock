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
			netValue: 0,
			netPercentage: 0,
			created: new Date()
		});

		console.log(stock);

		var stockId = Stocks.insert(stock);
		return {
			_id: stockId	
		};
	},
	updateStock: function(stockId, stockAttributes) {

		var stock = Stocks.findOne({_id: stockId});

		var portfolioId = stock.portfolioId;

		var positionQuantity = stockAttributes.positionQuantity;
		var positionPrice = stockAttributes.positionPrice;
		var capital = stockAttributes.capital;
		var currentPrice = stock.currentPrice;

		var netValue = 0;
		var netCapital = 0;

		var marketValue = Math.abs(positionQuantity * currentPrice);

		// Long position
		if (positionQuantity > 0) {			
			netValue = marketValue - (positionQuantity * positionPrice);
			netCapital = capital;
		}
		// Short position
		else {
			netValue = (Math.abs(positionQuantity) * positionPrice) - marketValue;
			netCapital = capital + marketValue;
		}

		var netPercentage = (netValue / netCapital) * 100;
		var updatedStock = _.extend(stockAttributes, {
			netValue: netValue,
			netPercentage: netPercentage
		});

		Stocks.update(stockId, {$set: updatedStock});

		// Call refreshPortolio
		Meteor.call('refreshPortfolio', portfolioId, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	},
	removeStock: function(stockId) {
		var stock = Stocks.findOne({_id: stockId});
		var portfolioId = stock.portfolioId;

		Stocks.remove(stockId);
		Transactions.remove({stockId: stockId});

		// Call refreshPortolio
		Meteor.call('refreshPortfolio', portfolioId, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
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