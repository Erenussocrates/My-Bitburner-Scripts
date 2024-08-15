/** @param {NS} ns */
export async function main(ns) {
    const stockRecordFile = 'stock-record.txt';
    const stockAnalyzeScript = 'stockAnalyze.js';
    const updateInterval = 6; // 6 seconds

    // Access the global stockData object from stockAnalyze.js
    if (typeof globalThis.stockData === 'undefined') {
        ns.tprint("No stock data available. Make sure stockAnalyze.js is running.");
        return;
    }

    const stockData = globalThis.stockData;

    // Convert the stockData object to an array of entries and sort by raw median price in descending order
    const sortedStockEntries = Object.entries(stockData).sort(([, a], [, b]) => b.medianPriceRaw - a.medianPriceRaw);

    let logContent = '';
    let totalIntervals = 0;

    for (const [symbol, data] of sortedStockEntries) {
        const priceForecastList = data.rawPrices.map(pair => {
            if (pair[0] === '\n') return pair[0]; // Keep newlines as they are
            const [price, forecast] = pair;
            const formattedPrice = price >= 1000 
                ? `$${(price / 1000).toFixed(3)}k` 
                : `$${price.toFixed(3)}`;
            return `${formattedPrice}/${forecast.toFixed(2)}`;
        }).join(' > ');

        const lowestPriceFormatted = data.lowestPrice >= 1000 
            ? (data.lowestPrice / 1000).toFixed(3) + 'k' 
            : data.lowestPrice.toFixed(3);
        const highestPriceFormatted = data.highestPrice >= 1000 
            ? (data.highestPrice / 1000).toFixed(3) + 'k' 
            : data.highestPrice.toFixed(3);
        const medianPriceFormatted = data.medianPriceRaw >= 1000 
            ? (data.medianPriceRaw / 1000).toFixed(3) + 'k' 
            : data.medianPriceRaw.toFixed(3);

        logContent += `${symbol} > ${priceForecastList}\n`;
        logContent += `Lowest Price: $${lowestPriceFormatted}\n`;
        logContent += `Median Price: $${medianPriceFormatted}\n`;
        logContent += `Highest Price: $${highestPriceFormatted}\n`;
        logContent += `==========================================================\n`;

        totalIntervals = data.rawPrices.length;  // Each entry will have the same number of intervals
    }

    // Calculate total runtime
    const totalSeconds = totalIntervals * updateInterval;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    logContent += `\nTotal Runtime: ${hours} hours, ${minutes} minutes, ${seconds} seconds\n`;

    // Write the final content to the stock-record.txt file
    await ns.write(stockRecordFile, logContent, 'w');

    // Terminate the stockAnalyze.js script
    const analyzePID = ns.getRunningScript(stockAnalyzeScript, 'home');
    if (analyzePID) {
        ns.kill(analyzePID.pid);
    } else {
        ns.tprint(`${stockAnalyzeScript} is not running.`);
    }
}
