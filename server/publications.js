Meteor.publish('stocks', function() {
	var currentUserId = this.userId;
	return Stocks.find({userId: currentUserId});
})

Meteor.publish('transactions', function(stockId) {
	return transactions.find({stockId: stockId});
})