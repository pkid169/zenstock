Template.stockItem.events({
	'click .delete': function(e) {
		e.preventDefault();
		
		if (confirm('Delete this stock?')) {
			var currentStockId = this._id;
			Stocks.remove(currentStockId);
		}
	}
});