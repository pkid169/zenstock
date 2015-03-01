Meteor.methods({
	addPortfolio: function(portfolioAttributes) {
		var user = Meteor.user();

		var portfolio = _.extend(portfolioAttributes, {
			userId: user._id,
			netValue: 0,
			netPercentage: 0,
			dailyValue: 0,
			dailyPercentage: 0,
			dailyChangePercentage: 0,
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

		var netValue = 0;
		var netPercentage = 0;
		var dailyValue = 0;
		var dailyPercentage = 0;
		var dailyChangePercentage = 0;

		if (stocks && stocks.length > 0) {
			var positionedStockCount = 0;

			for (var i in stocks) {
				var stock = stocks[i];
				netValue += stock.netValue;
				netPercentage += stock.netPercentage;
				dailyValue += stock.dailyValue;

				// Only take into account of daily change percentage if has position in the stock
				if (stock.positionQuantity != 0) {
					dailyPercentage += stock.dailyPercentage;
					dailyChangePercentage += parseFloat(stock.currentChangePercentage);
					positionedStockCount++;
				}
			}
			netPercentage /= stocks.length;
			dailyPercentage /= stocks.length;
			dailyChangePercentage /= positionedStockCount;
		}

		var portfolio = {
			netValue: netValue,
			netPercentage: netPercentage,
			dailyValue: dailyValue,
			dailyPercentage: dailyPercentage,
			dailyChangePercentage: dailyChangePercentage
		}

		Portfolios.update(portfolioId, {$set: portfolio});
	}
});