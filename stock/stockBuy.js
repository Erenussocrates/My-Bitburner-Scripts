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
        "NVMD": "nova-med",
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

    while (true) {
        //const ratioMoney = ns.getServerMoneyAvailable(serverName) / ns.getServerMaxMoney(serverName);
        const buyPrice = ns.stock.getPrice(stockSymbol);
        const forecast = ns.stock.getForecast(stockSymbol);

        // Calculate the thresholds
        const buyThreshold = stockInfo.lowestPrice * 1.05;
        const availableMoney = ns.getPlayer().money;
        const maxSpend = availableMoney * 0.25; // 25% of your current money
        const sharesToBuy = Math.floor(maxSpend / buyPrice);

        // Check the buying conditions
        if (buyPrice <= buyThreshold && forecast > 0.5 && sharesToBuy > 0) {
            //const boughtShares = ns.stock.buy(stockSymbol, sharesToBuy);
            const boughtShares = ns.stock.buyStock(stockSymbol, sharesToBuy);
            //Apparently, "buyStock" returns "price per share" and not the number of bought
            //shares.
            //So, boughtShares = price per share

            if (boughtShares > 0) {
                const transactionCost = sharesToBuy * buyPrice;
                const transactionTime = new Date().toLocaleString();
                const receiptContent = `Bought ${sharesToBuy} shares of ${stockSymbol} at $${buyPrice.toFixed(2)} each for a total of $${transactionCost.toFixed(2)} on ${transactionTime}.\n`;

                await ns.write("stockReceipt.txt", receiptContent, "a");
                ns.tprint(`Bought ${sharesToBuy} shares of ${stockSymbol}.`);

                // Call stockSell.js for selling
                ns.run("stock/stockSell.js", 1, stockSymbol);
                return; // Exit after buying and launching the sell script
            } else {
                ns.print(`Failed to buy shares of ${stockSymbol}.`);
            }
        } else {
            ns.print(`Conditions not met for buying ${stockSymbol}. Waiting...`);
        }

        await ns.sleep(6000); // Wait for 6 seconds before checking again
    }
}
