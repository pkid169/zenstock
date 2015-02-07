Template.stockItem.events({
	'click .delete': function(e) {
		e.preventDefault();
		
		if (confirm('Delete this stock?')) {
			var currentStockId = this._id;
			Meteor.call('removeStock', currentStockId, function(error, result) {
				if (error) {
					alert(error);
				}
			});
		}
	},
	'click .refresh': function(e) {
		e.preventDefault();

		var stockId = this._id;
		var stockSymbol = this.symbol;

		getStockCurrentPrice(stockId, stockSymbol);
	}
});

Template.stockItem.helpers({
	capital: function() {
		return this.buyQuantity * this.buyPrice;
	},
	position: function() {
		var currentPosition = this.buyQuantity * (this.currentPrice - this.buyPrice);
		var currentPositionPercentage = ((this.currentPrice - this.buyPrice) / this.buyPrice) * 100;
		return ((currentPosition > 0) ? "+" : "-") + Math.abs(currentPosition).toFixed(2) + " (" + currentPositionPercentage.toFixed(2) + " %)";
	}
})