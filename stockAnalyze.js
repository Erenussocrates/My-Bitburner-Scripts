/** @param {NS} ns */
export async function main(ns) {
    const updateInterval = 6000; // 6 seconds
    const stocks = ns.stock.getSymbols();
    const stockData = {}; // To store data for each stock symbol

    // Helper function to calculate the median
    function calculateMedian(prices) {
        const sortedPrices = prices.slice().sort((a, b) => a[0] - b[0]); // Sort by price (first element)
        const middleIndex = Math.floor(sortedPrices.length / 2);

        if (sortedPrices.length % 2 === 0) {
            return (sortedPrices[middleIndex - 1][0] + sortedPrices[middleIndex][0]) / 2;
        } else {
            return sortedPrices[middleIndex][0];
        }
    }

    // Initialize the stockData object with arrays and variables for each stock symbol
    for (const symbol of stocks) {
        stockData[symbol] = {
            rawPrices: [], // To store raw prices and forecasts as pairs
            lowestPrice: Infinity,
            highestPrice: -Infinity,
            medianPriceRaw: 0, // New variable to store raw median price
            buyPrice: 0,  // To store the buy price
            sellPrice: 0  // To store the sell price
        };
    }

    // Expose the stockData object globally so it can be accessed by another script
    globalThis.stockData = stockData;

    // Main loop to update prices, forecasts, and buy/sell prices
    while (true) {
        for (const symbol of stocks) {
            const rawPrice = ns.stock.getPrice(symbol);
            const forecast = ns.stock.getForecast(symbol); // Get the current forecast
            const buyPrice = ns.stock.getAskPrice(symbol);  // Get the current buy (ask) price
            const sellPrice = ns.stock.getBidPrice(symbol); // Get the current sell (bid) price

            // Store price, forecast, buy price, and sell price as an object
            stockData[symbol].rawPrices.push([rawPrice, forecast]);

            // Update the buy and sell prices
            stockData[symbol].buyPrice = buyPrice;
            stockData[symbol].sellPrice = sellPrice;

            // Update lowest and highest prices
            if (rawPrice < stockData[symbol].lowestPrice) {
                stockData[symbol].lowestPrice = rawPrice;
            }
            if (rawPrice > stockData[symbol].highestPrice) {
                stockData[symbol].highestPrice = rawPrice;
            }

            // Update the raw median price
            stockData[symbol].medianPriceRaw = calculateMedian(stockData[symbol].rawPrices);

            // If there are 5 prices on the current line, start a new line
            if (stockData[symbol].rawPrices.length % 5 === 0) {
                stockData[symbol].rawPrices.push(['\n', '']); // Optional: you can remove this if not needed
            }
        }

        // Sleep for the update interval
        await ns.sleep(updateInterval);
    }
}
