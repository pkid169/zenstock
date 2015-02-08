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
		var theoreticalClosedPosition = "";
		var netValue = 0;
		var netCapital = 0;

		var marketValue = Math.abs(this.positionQuantity * this.currentPrice);

		// Long position
		if (this.positionQuantity > 0) {
			netValue = marketValue - (this.positionQuantity * this.positionPrice);
			netCapital = this.capital;
		}
		// Short position
		else {
			netValue = (Math.abs(this.positionQuantity) * this.positionPrice) - marketValue;
			netCapital = this.capital + marketValue;
		}
		var netPercentage = (netValue / netCapital) * 100;
		theoreticalClosedPosition += (netValue > 0 ? "+" : "") + netValue.toFixed(2) + " (" + (netPercentage > 0 ? "+" : "") + netPercentage.toFixed(2) + " %)";
		return theoreticalClosedPosition;
	}
	/*capital: function() {
		return this.buyQuantity * this.buyPrice;
	},
	position: function() {
		var currentPosition = this.buyQuantity * (this.currentPrice - this.buyPrice);
		var currentPositionPercentage = ((this.currentPrice - this.buyPrice) / this.buyPrice) * 100;
		return ((currentPosition > 0) ? "+" : "-") + Math.abs(currentPosition).toFixed(2) + " (" + currentPositionPercentage.toFixed(2) + " %)";
	}*/
});