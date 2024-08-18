/** @param {NS} ns */
export async function main(ns) {
    const stockSymbol = ns.args[0];
    const buyPrice = parseFloat(ns.args[1]);
    const sellPrice = parseFloat(ns.args[2]);

    if (!stockSymbol || isNaN(buyPrice) || isNaN(sellPrice)) {
        ns.tprint("Usage: run manualStockTransaction.js <stockSymbol> <buyPrice> <sellPrice>");
        return;
    }

    const maxBuyPrice = 1.1 * buyPrice;
    const minSellPrice = 0.9 * sellPrice;
    let boughtPrice = null;
    let sharesOwned = 0;
    let lossMitigationSwitch = false;

    // Buying phase
    while (true) {
        const currentBuyPrice = ns.stock.getPrice(stockSymbol);

        if (currentBuyPrice <= maxBuyPrice) {
            const availableMoney = ns.getServerMoneyAvailable("home");
            const maxSpend = availableMoney * 0.25; // 25% of available money
            const sharesToBuy = Math.floor(maxSpend / currentBuyPrice);

            if (sharesToBuy > 0) {
                const boughtShares = ns.stock.buyStock(stockSymbol, sharesToBuy);

                if (boughtShares > 0) {
                    boughtPrice = currentBuyPrice;
                    sharesOwned = boughtShares;
                    const totalSpent = boughtShares * currentBuyPrice;
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

    // Selling phase
    while (true) {
        const currentSellPrice = ns.stock.getPrice(stockSymbol);

        if (sharesOwned > 0) {
            // Check if price is good for selling
            if (currentSellPrice >= minSellPrice && currentSellPrice > boughtPrice) {
                const totalReceived = ns.stock.sellStock(stockSymbol, sharesOwned);

                if (totalReceived > 0) {
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${sharesOwned} shares of ${stockSymbol} at $${currentSellPrice.toFixed(2)} each for a total of $${totalReceived.toFixed(2)} on ${transactionTime}.\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${sharesOwned} shares of ${stockSymbol}.`);
                    break; // Exit the script after selling
                }
            }

            // Activate loss mitigation switch if conditions are met
            if (currentSellPrice > 1.1 * boughtPrice) {
                lossMitigationSwitch = true;
            }

            // Sell shares if loss mitigation switch is true and price drops below threshold
            if (lossMitigationSwitch && currentSellPrice <= 1.1 * boughtPrice) {
                const totalReceived = ns.stock.sellStock(stockSymbol, sharesOwned);

                if (totalReceived > 0) {
                    const transactionTime = new Date().toLocaleString();
                    const receiptContent = `Sold ${sharesOwned} shares of ${stockSymbol} at $${currentSellPrice.toFixed(2)} each for a total of $${totalReceived.toFixed(2)} on ${transactionTime} (Loss Mitigation).\n`;

                    await ns.write("stockReceipt.txt", receiptContent, "a");
                    ns.tprint(`Sold ${sharesOwned} shares of ${stockSymbol} (Loss Mitigation).`);
                    break; // Exit the script after selling
                }
            }
        }

        await ns.sleep(6000); // Wait for 6 seconds before checking again
    }
}
