Template.portfolioItem.helpers({
	portfolioNetPosition: function() {
		return ((this.netValue > 0) ? "+" : "") + this.netValue.toFixed(2) + " (" + this.netPercentage.toFixed(2) + " %)";
	},
	colorIndicator: function() {
		return (this.netValue > 0) ? "positive" : "negative";
	}
});