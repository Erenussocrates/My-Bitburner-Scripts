/** @param {NS} ns */
export async function main(ns) {
    const stockSymbol = ns.args[0];
    const buyPrice = ns.args[1];
    const sellPrice = parseFloat(ns.args[2]);
 
    if (!stockSymbol || (isNaN(buyPrice) && typeof buyPrice !== "string") || isNaN(sellPrice)) {
        ns.tprint("Usage: run manualStockTransaction.js <stockSymbol> <buyPrice> <sellPrice>");
        return;
    }
 
    const isSellOnly = typeof buyPrice === "string" && buyPrice.toLowerCase() === "sellonly";
    const parsedBuyPrice = parseFloat(buyPrice);
 
    if (!isSellOnly && isNaN(parsedBuyPrice)) {
        ns.tprint("Usage: run manualStockTransaction.js <stockSymbol> <buyPrice> <sellPrice>");
        return;
    }
 
    const maxBuyPrice = isSellOnly ? null : 1.1 * parsedBuyPrice;
    const minSellPrice = 0.9 * sellPrice;
    const fourtyPercentThreshold = isSellOnly ? null : (parsedBuyPrice + minSellPrice) / 2;
    const midPriceThreshold = isSellOnly ? null : (parsedBuyPrice + sellPrice) / 2;
    const seventyPercentThreshold = isSellOnly ? null : (parsedBuyPrice + minSellPrice) * 0.75;
    const realSeventyPercentThreshold = isSellOnly ? null : (parsedBuyPrice + sellPrice) * 0.75;
 
    let boughtPrice = isSellOnly ? null : parsedBuyPrice;
    let sharesOwned = 0;
    let lossMitigationSwitch = false;
    let fourtyPercentSwitch = false;
    let midThreshold = false;
    let seventyPercentSwitch = false;
    let realSeventyPercentSwitch = false;
 
    // If "sellonly" mode, skip to selling phase and initialize sharesOwned
    if (isSellOnly) {
        sharesOwned = ns.stock.getPosition(stockSymbol)[0];
        if (sharesOwned <= 0) {
            ns.tprint("No shares owned for stock: " + stockSymbol);
            return;
        }
        ns.print("Sell only mode activated for stock: " + stockSymbol);
    } else {
        // Buying phase
        while (true) {
            const currentBuyPrice = ns.stock.getPrice(stockSymbol);
 
            if (currentBuyPrice <= maxBuyPrice) {
                const availableMoney = ns.getServerMoneyAvailable("home");
                const maxSpend = availableMoney * 0.25; // 25% of available money
                const sharesToBuy = Math.floor(maxSpend / currentBuyPrice);
 
                if (sharesToBuy > 0) {
                    //Apparently, "buyStock" returns "price per share" and not the number of
                    //shares bought.
                    //So, boughtShares = price per share
                    const boughtShares = ns.stock.buyStock(stockSymbol, sharesToBuy);
 
                    if (boughtShares > 0) {
                        boughtPrice = currentBuyPrice;
                        //sharesOwned = boughtShares;
                        sharesOwned = sharesToBuy;
                        //const totalSpent = boughtShares * currentBuyPrice;
                        const totalSpent = sharesToBuy * currentBuyPrice;
                        const transactionTime = new Date().toLocaleString();
                        const receiptContent = `Bought ${sharesOwned} shares of ${stockSymbol} at $${boughtPrice.toFixed(2)} each for a total of $${totalSpent.toFixed(2)} on ${transactionTime}.\n`;
 
                        await ns.write("stockReceipt.txt", receiptContent, "a");
                        ns.tprint(`Bought ${sharesOwned} shares of ${stockSymbol}.`);
                        break; // Exit the buying loop and proceed to selling phase
                    } else {
                        ns.print(`Failed to buy shares of ${stockSymbol}.`);
                    }
                } else {
                    ns.print("Not enough funds to buy shares.");
                }
            } else {
                ns.print(`Current buy price of ${stockSymbol} ($${currentBuyPrice.toFixed(2)}) is higher than max buy price ($${maxBuyPrice.toFixed(2)}). Waiting...`);
            }
 
            await ns.sleep(6000); // Wait for 6 seconds before checking again
        }
    }
 
    // Selling phase
    while (true) {
        const currentSellPrice = ns.stock.getPrice(stockSymbol);
 
        if (sharesOwned > 0) {
            let receiptNote = " (Optimal Profit)";
 
            if (!isSellOnly) {
                // Activate loss mitigation switch if conditions are met
                if (currentSellPrice > 1.1 * boughtPrice) {
                    lossMitigationSwitch = true;
                }
 
                if (currentSellPrice > fourtyPercentThreshold) {
                    fourtyPercentSwitch = true;
                }
 
                // Check if midThreshold switch should be turned on
                if (currentSellPrice > midPriceThreshold) {
                    midThreshold = true;
                }
 
                if (currentSellPrice > seventyPercentThreshold) {
                    seventyPercentSwitch = true;
                }
 
                if (currentSellPrice > realSeventyPercentThreshold) {
                    realSeventyPercentSwitch = true;
                }
 
                if ((currentSellPrice >= minSellPrice && currentSellPrice > boughtPrice) ||
                    (realSeventyPercentSwitch && currentSellPrice <= realSeventyPercentThreshold) ||
                    (seventyPercentSwitch && currentSellPrice <= seventyPercentThreshold) ||
                    (midThreshold && currentSellPrice <= midPriceThreshold) ||
                    (fourtyPercentSwitch && currentSellPrice <= fourtyPercentThreshold) ||
                    (lossMitigationSwitch && currentSellPrice <= 1.1 * boughtPrice)) {
 
                    if (realSeventyPercentSwitch && currentSellPrice <= realSeventyPercentThreshold) {
                        receiptNote = " (75%-Point Mitigation)";
                    } else if (seventyPercentSwitch && currentSellPrice <= seventyPercentThreshold) {
                        receiptNote = " (67%-Point Mitigation)";
                    } else if (midThreshold && currentSellPrice <= midPriceThreshold) {
                        receiptNote = " (Mid-Point Mitigation)";
                    } else if (fourtyPercentSwitch && currentSellPrice <= fourtyPercentThreshold) {
                        receiptNote = " (45%-Point Mitigation)";
                    } else if (lossMitigationSwitch && currentSellPrice <= 1.1 * boughtPrice) {
                        receiptNote = " (Loss Mitigation)";
                    }
					
					      //Similarly, "sellStock" returns "price per share" and not the number of
                //shares sold.
                //So, totalReceived = price per share
                const totalReceived = ns.stock.sellStock(stockSymbol, sharesOwned);
                const totalSoldPrice=totalReceived*sharesOwned;

                if (totalReceived > 0) {
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${sharesOwned} shares of ${stockSymbol} at $${currentSellPrice.toFixed(2)} each for a total of $${totalSoldPrice.toFixed(2)} on ${transactionTime}${receiptNote}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${sharesOwned} shares of ${stockSymbol}${receiptNote}.`);
                    break; // Exit the script after selling
                  }
					
              }
            } else {
                // In "sellonly" mode, only check the current sell price against minSellPrice
                if (currentSellPrice >= minSellPrice) {
                    receiptNote = " (Sell Only)";
					
					      //Similarly, "sellStock" returns "price per share" and not the number of
                //shares sold.
                //So, totalReceived = price per share
                const totalReceived = ns.stock.sellStock(stockSymbol, sharesOwned);
                const totalSoldPrice=totalReceived*sharesOwned;

                if (totalReceived > 0) {
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${sharesOwned} shares of ${stockSymbol} at $${currentSellPrice.toFixed(2)} each for a total of $${totalSoldPrice.toFixed(2)} on ${transactionTime}${receiptNote}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${sharesOwned} shares of ${stockSymbol}${receiptNote}.`);
                    break; // Exit the script after selling
                  }
					
              } 
				
            }
 
        }
 
        await ns.sleep(6000); // Wait for 6 seconds before checking again
    }
}
