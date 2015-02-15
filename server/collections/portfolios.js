Meteor.methods({
	addPortfolio: function(portfolioAttributes) {
		var user = Meteor.user();

		var portfolio = _.extend(portfolioAttributes, {
			userId: user._id,
			netValue: 0,
			netPercentage: 0,
			created: new Date()
		});

		var portfolioId = Portfolios.insert(portfolio);
		return {
			_id: portfolioId
		};
	},
	updatePortfolio: function(portfolioId, portfolioAttributes) {
		Portfolios.update(portfolioId, {$set: portfolioAttributes});
	},
	removePortfolio: function(portfolioId) {
		Portfolios.remove(portfolioId);
		Stocks.remove({portfolioId: portfolioId});
		Transactions.remove({portfolioId: portfolioId});
	},
	refreshPortfolio: function(portfolioId) {
		var stocks = Stocks.find({portfolioId: portfolioId}).fetch();
		console.log(stocks);

		console.log('stocks length: ' + stocks.length);

		var netValue = 0;
		var netPercentage = 0;

		for (var i in stocks) {
			var stock = stocks[i];
			netValue += stock.netValue;
			netPercentage += stock.netPercentage;
		}

		netPercentage /= stocks.length;

		console.log('netValue: ' + netValue + ' - netPercentage: ' + netPercentage);

		var portfolio = {
			netValue: netValue,
			netPercentage: netPercentage
		}

		Portfolios.update(portfolioId, {$set: portfolio});
	}
});