Template.stocksList.helpers({
	stocks: function() {
		return Stocks.find();
	}
});