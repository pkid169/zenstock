Meteor.methods({
	addTransaction: function(transactionAttributes) {
		// Insert transaction
		var transaction = _.extend(transactionAttributes, {
			created: new Date()
		});
		Transactions.insert(transaction);

		// Update stock
		var stock = Stocks.findOne({_id: transactionAttributes.stockId});

		var price = transactionAttributes.price;
		var direction = transactionAttributes.direction;
		var quantity = transactionAttributes.quantity;
		var signedQuantity = (direction === "buy" ? 1 : -1) * quantity;

		var updatedQuantity = signedQuantity + stock.positionQuantity;
		var updatedPrice = ((stock.positionQuantity * stock.positionPrice) + (signedQuantity * price)) / updatedQuantity;

		var updatedPosition = {
			positionQuantity: updatedQuantity,
			positionPrice: updatedPrice
		};

		if (direction === "buy") {
			updatedPosition.capital = stock.capital + (quantity * price);
		}

		Meteor.call('updateStock', stock._id, updatedPosition, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	}
});