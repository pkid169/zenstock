Meteor.publish('stocks', function() {
	var currentUserId = this.userId;
	return Stocks.find({userId: currentUserId});
})