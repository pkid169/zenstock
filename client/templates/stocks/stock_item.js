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

		Meteor.call('getStockCurrentPrice', stockId, stockSymbol, function(error, result) {
			if (error) {
				alert(error);
			}
		});
	},
	'click .transact': function(e) {
		e.preventDefault();

		var stockId = this._id;
		Router.go('/transact/' + stockId);
	}
});

Template.stockItem.helpers({
	hasPosition: function() {
		return (this.positionQuantity != 0);
	},
	position: function() {
		var position = ((this.positionQuantity > 0) ? "Long" : "Short") + " " + this.positionQuantity;
		position += " @ " + this.positionPrice;
		return position;
	},
	theoreticalClosedPosition: function() {
		var theoreticalClosedPosition = (this.netValue > 0 ? "+" : "") + this.netValue.toFixed(2) + " (" + (this.netPercentage > 0 ? "+" : "") + this.netPercentage.toFixed(2) + " %)";
		return theoreticalClosedPosition;
	},
	colorIndicator: function() {
		return this.currentChange >= 0 ? "positive" : "negative";
	}
});