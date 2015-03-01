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
			}  else {
				Router.go('/');
			}
		})
	}
});