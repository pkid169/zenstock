Meteor.publish('stocks', function() {
	var currentUserId = this.userId;
	return Stocks.find({userId: currentUserId});
});

Meteor.publish('transactions', function(stockId) {
	return Transactions.find({stockId: stockId});
});

Meteor.publish('portfolios', function() {
	var currentUserId = this.userId;
	return Portfolios.find({userId: currentUserId});
});