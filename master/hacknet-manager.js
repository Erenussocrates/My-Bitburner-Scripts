/** @param {NS} ns */
export async function main(ns) {
    const upgradeThreshold = 0.9; // Fraction of your money to use for upgrades
    //Basically means I'll only use 10% of my money to upgrade

    // Calculate the initial buffer amount
    const initialMoney = ns.getServerMoneyAvailable("home");
    const bufferMoney = initialMoney * upgradeThreshold;

    while (true) {
        const moneyAvailable = ns.getServerMoneyAvailable("home");

        // Get the number of nodes
        const numNodes = ns.hacknet.numNodes();

        // Calculate the efficiency of buying a new node
        const newNodeCost = ns.hacknet.getPurchaseNodeCost();
        let newNodeIncome = 0;
        if (numNodes > 0) {
            newNodeIncome = ns.hacknet.getNodeStats(0).production;
        }
        const newNodeEfficiency = newNodeCost / (newNodeIncome + 1); 
        // Add 1 to avoid division by zero

        let bestUpgrade = null;
        let bestCostPerGain = Infinity;

        // Iterate over all existing Hacknet nodes and calculate the best upgrade
        for (let i = 0; i < numNodes; i++) {
            // Get current production
            const currentProduction = ns.hacknet.getNodeStats(i).production;

            // Calculate cost-benefit for level upgrade
            const levelUpgradeCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            if (levelUpgradeCost <= moneyAvailable - bufferMoney) {
                ns.hacknet.upgradeLevel(i, 1);
                const newProduction = ns.hacknet.getNodeStats(i).production;
                ns.hacknet.upgradeLevel(i, -1); // revert the upgrade to get the correct gain
                const levelIncomeGain = newProduction - currentProduction;
                const levelCostPerGain = levelUpgradeCost / levelIncomeGain;
                if (levelCostPerGain < bestCostPerGain) {
                    bestCostPerGain = levelCostPerGain;
                    bestUpgrade = { type: 'level', cost: levelUpgradeCost, node: i };
                }
            }

            // Calculate cost-benefit for RAM upgrade
            const ramUpgradeCost = ns.hacknet.getRamUpgradeCost(i, 1);
            if (ramUpgradeCost <= moneyAvailable - bufferMoney) {
                ns.hacknet.upgradeRam(i, 1);
                const newProduction = ns.hacknet.getNodeStats(i).production;
                ns.hacknet.upgradeRam(i, -1); // revert the upgrade to get the correct gain
                const ramIncomeGain = newProduction - currentProduction;
                const ramCostPerGain = ramUpgradeCost / ramIncomeGain;
                if (ramCostPerGain < bestCostPerGain) {
                    bestCostPerGain = ramCostPerGain;
                    bestUpgrade = { type: 'ram', cost: ramUpgradeCost, node: i };
                }
            }

            // Calculate cost-benefit for core upgrade
            const coreUpgradeCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            if (coreUpgradeCost <= moneyAvailable - bufferMoney) {
                ns.hacknet.upgradeCore(i, 1);
                const newProduction = ns.hacknet.getNodeStats(i).production;
                ns.hacknet.upgradeCore(i, -1); // revert the upgrade to get the correct gain
                const coreIncomeGain = newProduction - currentProduction;
                const coreCostPerGain = coreUpgradeCost / coreIncomeGain;
                if (coreCostPerGain < bestCostPerGain) {
                    bestCostPerGain = coreCostPerGain;
                    bestUpgrade = { type: 'core', cost: coreUpgradeCost, node: i };
                }
            }
        }

        // Compare with buying a new node
        if (newNodeEfficiency < bestCostPerGain && moneyAvailable >= newNodeCost + bufferMoney) {
            ns.hacknet.purchaseNode();
        } else if (bestUpgrade !== null) {
            // Perform the best upgrade if one was found
            if (bestUpgrade.type === 'level') {
                ns.hacknet.upgradeLevel(bestUpgrade.node, 1);
            } else if (bestUpgrade.type === 'ram') {
                ns.hacknet.upgradeRam(bestUpgrade.node, 1);
            } else if (bestUpgrade.type === 'core') {
                ns.hacknet.upgradeCore(bestUpgrade.node, 1);
            }
            await ns.sleep(500);
        }

        // Wait a bit before checking again
        await ns.sleep(500);
    }
}
