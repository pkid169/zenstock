Template.stocksList.helpers({
	stocks: function() {
		return Stocks.find({portfolioId: Session.get('activePortfolioId')});
	}
});