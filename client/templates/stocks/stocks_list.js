var stocksData = [
	{
		symbol: 'AAPL',
		price: 200
	},
	{
		symbol: 'MSFT',
		price: 60.5
	},
	{
		symbol: 'GOOG',
		price: 175
	}
];

Template.stocksList.helpers({
	stocks: stocksData
});