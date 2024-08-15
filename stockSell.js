/** @param {NS} ns */
export async function main(ns) {
    const stockSymbol = ns.args[0];
    if (!stockSymbol) {
        ns.tprint("Please provide a stock symbol as an argument.");
        return;
    }

    const serverStockMap = {
        // Add your stock symbol to server name mappings here
        "FNS": "foodnstuff",
        "JGN": "joesguns",
        "SGC": "sigma-cosmetics",
        "OMGA": "omega-net",
        "CTK": "computek",
        "NTLK": "netlink",
        // Add other mappings as needed
    };

    const serverName = serverStockMap[stockSymbol];
    if (!serverName) {
        ns.tprint(`No server mapping found for stock symbol ${stockSymbol}.`);
        return;
    }

    const stockData = globalThis.stockData;
    if (!stockData || !stockData[stockSymbol]) {
        ns.tprint("No stock data available. Make sure stockAnalyze.js is running.");
        return;
    }

    const stockInfo = stockData[stockSymbol];
    let sellSwitch = false;

    while (true) {
        const ratioMoney = ns.getServerMoneyAvailable(serverName) / ns.getServerMaxMoney(serverName);
        const sellPrice = ns.stock.getPrice(stockSymbol);
        const forecast = ns.stock.getForecast(stockSymbol);
        const boughtShares = ns.stock.getPosition(stockSymbol)[0];
        const buyPrice = stockInfo.rawPrices[0][0]; // Assume the first recorded price is the buy price
        const sellThreshold = stockInfo.highestPrice * 0.95;
        const stopLossThreshold = buyPrice * 1.1;

        // Check if the switch should be turned on
        if (sellPrice > stopLossThreshold) {
            sellSwitch = true;
        }

        // Check the selling conditions
        if (boughtShares > 0) {
            if (sellSwitch && sellPrice <= stopLossThreshold || 
                (ratioMoney > ns.getServerMaxMoney(serverName)*0.9 && 
                sellPrice >= sellThreshold && 
                forecast <= 0.45)) {
                
                //const soldShares = ns.stock.sell(stockSymbol, boughtShares);
                const soldShares = ns.stock.sellStock(stockSymbol, boughtShares);

                if (soldShares > 0) {
                    const transactionRevenue = soldShares * sellPrice;
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${soldShares} shares of ${stockSymbol} at $${sellPrice.toFixed(2)} each for a total of $${transactionRevenue.toFixed(2)} on ${transactionTime}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${soldShares} shares of ${stockSymbol}.`);
                    return; // Exit after selling
                } else {
                    ns.print(`Failed to sell shares of ${stockSymbol}.`);
                }
            } else {
                ns.print(`Conditions not met for selling ${stockSymbol}. Waiting...`);
            }
        } else {
            ns.print(`No shares of ${stockSymbol} to sell.`);
            return; // Exit if no shares are held
        }

        await ns.sleep(6000); // Wait for 6 seconds before checking again
    }
}
