/** @param {NS} ns */
export async function main(ns) {
    const updateInterval = 6000; // 6 seconds
    const stocks = ns.stock.getSymbols();
    const stockData = {}; // To store data for each stock symbol

    // Parse and validate arguments
    let runTime = null;
    let isAutoRun = false; // New flag to indicate auto-run

    if (ns.args.length === 2) {
        const duration = parseInt(ns.args[0], 10);
        const unit = ns.args[1];
        
        if (isNaN(duration) || duration <= 0) {
            ns.tprint("ERROR: Invalid duration. Please provide a positive integer.");
            return;
        }

        if (unit === 'm') {
            runTime = duration * 60 * 1000; // Convert minutes to milliseconds
        } else if (unit === 'h') {
            runTime = duration * 60 * 60 * 1000; // Convert hours to milliseconds
        } else {
            ns.tprint("ERROR: Invalid time unit. Use 'm' for minutes or 'h' for hours.");
            return;
        }

        isAutoRun = true; // Set flag indicating this is a timed auto-run
    } else if (ns.args.length !== 0) {
        ns.tprint("ERROR: Invalid number of arguments. Provide either 0 or 2 arguments.");
        return;
    }

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

    // Start time tracking
    const startTime = Date.now();

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

            // Optional: if there are 5 prices on the current line, start a new line
            if (stockData[symbol].rawPrices.length % 5 === 0) {
                stockData[symbol].rawPrices.push(['\n', '']); // Optional: you can remove this if not needed
            }
        }

        // Check if the run time has elapsed, and if so, run stockPrint.js
        if (runTime !== null && Date.now() - startTime >= runTime) {
            ns.tprint("Specified time is up! Running stockPrint.js...");
            ns.run("stock/stockPrint.js", 1, isAutoRun ? "auto" : "manual"); // Pass "auto" or "manual" as an argument to stockPrint.js
            return; // Exit to prevent re-running stockPrint.js
        }

        // Sleep for the update interval
        await ns.sleep(updateInterval);
    }
}
