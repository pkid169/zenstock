Template.portfolioItem.helpers({
	portfolioNetPosition: function() {
		return ((this.netValue > 0) ? "+" : "") + this.netValue.toFixed(2) + " (" + this.netPercentage.toFixed(2) + " %)";
	},
	portfolioDailyPosition: function() {
		if (this.netValue != 0) {
			return ((this.dailyValue > 0) ? "+" : "") + this.dailyValue.toFixed(2) + " (" + this.dailyChangePercentage.toFixed(2) + " %)";
		} else {
			return ((this.dailyValue > 0) ? "+" : "") + this.dailyValue.toFixed(2) + " (0.00 %)";
		}
	},
	colorIndicator: function(value) {
		console.log(value);
		return (value > 0) ? "positive" : "negative";
	}
});