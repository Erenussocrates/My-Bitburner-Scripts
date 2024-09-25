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
        "SYSC": "syscore",
        "LXO": "lexo-corp",
        "SLRS": "solaris",
        "NVMD":"nova-med",
        "GPH": "global-pharm",
        "AERO": "aerocorp",
        "UNV": "univ-energy",
        "ICRS": "icarus",
        "OMN": "omnia",
        "DCOMM": "defcomm",
        "TITN": "titan-labs",
        "MDYN": "microdyne",
        "VITA": "vitalife",
        "STM": "stormtech",
        "HLS": "helios",
        "OMTK": "omnitek",
        "KGI": "kuai-gong",
        "FSIG": "4sigma",
        "FLCM": "fulcrumtech",
        "MGCP": "megacorp",
        "BLD": "blade",
        "ECP": "ecorp",
        "CLRK": "clarkinc",
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
    let realMidSwitch = false;
    let seventyPercentSwitch = false;
    let realSeventyPercentSwitch = false;

    const sellThreshold = stockInfo.highestPrice * 0.9;
    const stopLossThreshold = stockInfo.rawPrices[0][0] * 1.1;
    const midPriceThreshold = (stockInfo.rawPrices[0][0] + sellThreshold) / 2;
    const realMidThreshold = (stockInfo.rawPrices[0][0] + stockInfo.highestPrice) / 2;
    const seventyPercentThreshold = (stockInfo.rawPrices[0][0] + sellThreshold) * 0.75;
    const realSeventyPercentThreshold = (stockInfo.rawPrices[0][0] + stockInfo.highestPrice) * 0.75;

    while (true) {
        //const ratioMoney = ns.getServerMoneyAvailable(serverName) / ns.getServerMaxMoney(serverName);
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

        if (sellPrice > realMidThreshold) {
          realMidSwitch = true;
        }

        if (sellPrice > seventyPercentThreshold) {
          seventyPercentSwitch = true;
        }

        if (sellPrice > realSeventyPercentThreshold) {
          realSeventyPercentSwitch = true;
        }

        // Check the selling conditions
        if (boughtShares > 0) {
            let receiptNote = " (Optimal Profit)";

            if ( (sellSwitch && sellPrice <= stopLossThreshold) ||
                (midThreshold && sellPrice <= midPriceThreshold) ||
                (realMidSwitch && sellPrice <= realMidThreshold) ||
                (seventyPercentSwitch && sellPrice <= seventyPercentThreshold) ||
                (realSeventyPercentSwitch && sellPrice <= realSeventyPercentThreshold) ||
                (sellPrice >= sellThreshold &&
                forecast <= 0.5) ) {

                if (sellSwitch && sellPrice <= stopLossThreshold) {
                    receiptNote = " (Loss Mitigation)";
                }
                else if (midThreshold && sellPrice <= midPriceThreshold) {
                  receiptNote = " (45%-Point Mitigation)";
                }
                else if (realMidSwitch && sellPrice <= realMidThreshold) {
                  receiptNote = " (Mid-Point Mitigation)";
                }
                else if (seventyPercentSwitch && sellPrice <= seventyPercentThreshold) {
                  receiptNote = " (67%-Point Mitigation)";
                }
                else if (realSeventyPercentSwitch && sellPrice <= realSeventyPercentThreshold) {
                  receiptNote = " (75%-Point Mitigation)";
                }

                const soldShares = ns.stock.sellStock(stockSymbol, boughtShares);
                //"sellStock" returns the "price per share" and not the number of shares
                //sold.
                //So, soldShares = price per share
 
                if (soldShares > 0) {
                    const transactionRevenue = boughtShares * sellPrice;
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${boughtShares} shares of ${stockSymbol} at $${sellPrice.toFixed(2)} each for a total of $${transactionRevenue.toFixed(2)} on ${transactionTime}${receiptNote}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${boughtShares} shares of ${stockSymbol}${receiptNote}.`);
                    return; // Exit after selling
                } else {
                    ns.print(`Failed to sell shares of ${stockSymbol}.`);
                }
            }

            else {
                ns.print(`Conditions not met for selling ${stockSymbol}. Waiting...`);
            }
        } else {
            ns.print(`No shares of ${stockSymbol} to sell.`);
            return; // Exit if no shares are held
        }

        await ns.sleep(6000); // Wait for 6 seconds before checking again
    }
}
