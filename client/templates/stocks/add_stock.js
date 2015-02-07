Template.addStock.events({
	'submit form': function(e) {
		e.preventDefault();

		var stock = {
			symbol: $(e.target).find('[name=symbol]').val(),
			price: $(e.target).find('[name=price]').val()
		};

		stock._id = Stocks.insert(stock);
		Router.go('stocksList');
	}
})