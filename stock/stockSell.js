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
        "CTYS": "catalyst",
        "RHOC": "rho-construction",
        "APHE": "alpha-ent",
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
    let midThreshold = false;

    const sellThreshold = stockInfo.highestPrice * 0.95;
    const stopLossThreshold = stockInfo.rawPrices[0][0] * 1.1;
    const midPriceThreshold = (stockInfo.rawPrices[0][0] + sellThreshold) / 2;

    while (true) {
        const ratioMoney = ns.getServerMoneyAvailable(serverName) / ns.getServerMaxMoney(serverName);
        const sellPrice = ns.stock.getPrice(stockSymbol);
        const forecast = ns.stock.getForecast(stockSymbol);
        const boughtShares = ns.stock.getPosition(stockSymbol)[0];

        // Check if the loss mitigation switch should be turned on
        if (sellPrice > stopLossThreshold) {
            sellSwitch = true;
        }

        // Check if midThreshold switch should be turned on
        if (sellPrice > midPriceThreshold) {
            midThreshold = true;
        }

        // Check the selling conditions
        if (boughtShares > 0) {
            let receiptNote = "";

            if ((sellSwitch && sellPrice <= stopLossThreshold) ||
                (ratioMoney > ns.getServerMaxMoney(serverName) * 0.9 &&
                sellPrice >= sellThreshold &&
                forecast <= 0.45)) {

                if (sellSwitch && sellPrice <= stopLossThreshold) {
                    receiptNote = " (Loss Mitigation)";
                }

                const soldShares = ns.stock.sellStock(stockSymbol, boughtShares);

                if (soldShares > 0) {
                    const transactionRevenue = soldShares * sellPrice;
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${soldShares} shares of ${stockSymbol} at $${sellPrice.toFixed(2)} each for a total of $${transactionRevenue.toFixed(2)} on ${transactionTime}${receiptNote}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${soldShares} shares of ${stockSymbol}${receiptNote}.`);
                    return; // Exit after selling
                } else {
                    ns.print(`Failed to sell shares of ${stockSymbol}.`);
                }
            }

            // Sell shares if midThreshold switch is true and price drops below midPriceThreshold
            else if (midThreshold && sellPrice <= midPriceThreshold) {
                const soldShares = ns.stock.sellStock(stockSymbol, boughtShares);

                if (soldShares > 0) {
                    const transactionRevenue = soldShares * sellPrice;
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${soldShares} shares of ${stockSymbol} at $${sellPrice.toFixed(2)} each for a total of $${transactionRevenue.toFixed(2)} on ${transactionTime} (Mid-Threshold Trigger).\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${soldShares} shares of ${stockSymbol} (Mid-Threshold Trigger).`);
                    return; // Exit after selling
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
