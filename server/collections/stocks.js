Meteor.methods({
	addStock: function(stockAttributes) {

		// Add stock
		var user = Meteor.user();
		var stock = _.extend(stockAttributes, {
			userId: user._id,
			currentPrice: 0,
			currentChange: 0,
			currentChangePercentage: 0,
			positionQuantity: 0,
			positionPrice: 0,
			capital: 0,
			netValue: 0,
			netPercentage: 0,
			dailyValue: 0,
			dailyPercentage: 0,
			created: new Date()
		});
		var stockId = Stocks.insert(stock);
		
		// Update current price
		Meteor.call('getStockCurrentPrice', stockId, function(error, result) {
			if (error) {
				console.log(error);
			}
		});

	},
	getStockCurrentPrice: function(stockId) {
		var stock = Stocks.findOne({_id: stockId});

		Meteor.http.get("http://finance.google.com/finance/info?client=ig&q=" + stock.symbol, function (err, res) {
			var respContent = res.content.replace("// ", "");
			var respStock = JSON.parse(respContent)[0];
			var newPrice = respStock.l;
			var newChange = respStock.c;
			var newChangePercentage = respStock.cp;

			var updatedStock = {
				currentPrice: newPrice,
				currentChange: newChange,
				currentChangePercentage: newChangePercentage
			}

			Stocks.update(stockId, {$set: updatedStock});
			Meteor.call('refreshStockPosition', stockId, function(error, result) {
				if (error) {
					console.log(error);
				}
			});
		});
	},
	updateStock: function(stockId, stockAttributes) {
		Stocks.update(stockId, {$set: stockAttributes});
		Meteor.call('refreshStockPosition', stockId, function(error, result) {
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
	refreshStockPosition: function(stockId) {
		var stock = Stocks.findOne({_id: stockId});

		// input
		var positionQuantity = stock.positionQuantity;
		var positionPrice = stock.positionPrice;
		var capital = stock.capital;
		var currentPrice = stock.currentPrice;
		var currentChange = stock.currentChange;

		// used to update stock's attributes
		var newNetValue = 0;
		var newNetPercentage = 0;
		var newDailyValue = 0;
		var newDailyPercentage = 0;

		// used for calculation
		var netCapital = 0;
		var marketValue = Math.abs(positionQuantity * currentPrice);

		// Value
		if (positionQuantity > 0) {			
			newNetValue = marketValue - (positionQuantity * positionPrice);
			netCapital = capital;
		}
		// Short position
		else {
			newNetValue = (Math.abs(positionQuantity) * positionPrice) - marketValue;
			netCapital = capital + marketValue;
		}
		newDailyValue = currentChange * positionQuantity;

		// Percentage
		if (netCapital > 0) {
			newNetPercentage = (newNetValue / netCapital) * 100;
			newDailyPercentage = (newDailyValue / netCapital) * 100;
		}

		var updatedStock = {
			netValue: newNetValue,
			netPercentage: newNetPercentage,
			dailyValue: newDailyValue,
			dailyPercentage: newDailyPercentage
		};

		Stocks.update(stockId, {$set: updatedStock});

		Meteor.call('refreshPortfolio', stock.portfolioId, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	}
});