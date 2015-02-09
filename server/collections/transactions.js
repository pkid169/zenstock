Meteor.methods({
	addTransaction: function(transactionAttributes) {
		var transaction = _.extend(transactionAttributes, {
			created: new Date()
		});

		Transactions.insert(transaction);
	}
});