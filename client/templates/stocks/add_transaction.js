Template.addTransaction.events({
	'submit form': function(e, template) {
		e.preventDefault();

		var stock = Stocks.findOne(template.data._id);

		var submittedForm = $(e.target);
		var transaction = {
			direction: submittedForm.find('[name=direction]').val(),
			quantity: submittedForm.find('[name=quantity]').val(),
			price: submittedForm.find('[name=price]').val(),
			stockId: stock._id
		};

		Meteor.call('addTransaction', transaction, function(error, result) {
			if (error) {
				alert(error);
			} else {
				// Update stock position
				var signedTransactionQuantity = (transaction.direction === "buy" ? 1 : -1) * transaction.quantity;
				var updatedQuantity =  signedTransactionQuantity + stock.positionQuantity;
				var updatedPrice = ((stock.positionQuantity * stock.positionPrice) + (signedTransactionQuantity * transaction.price)) / updatedQuantity;

				var updatedPosition = {
					positionQuantity: updatedQuantity,
					positionPrice: updatedPrice
				}

				if (transaction.direction === "buy") {
					updatedPosition.capital = stock.capital + (transaction.quantity * transaction.price);
				}

				Meteor.call('updateStock', stock._id, updatedPosition, function(error, result) {
					if (error) {
						alert(error);
					} else {
						Router.go('/');
					}
				});
			}
		})
	}
});