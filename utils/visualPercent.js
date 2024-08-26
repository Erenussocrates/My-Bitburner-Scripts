/** @param {NS} ns */
export async function main(ns) {
    // Determine which file to use based on the argument
    let serverListFile = 'all-list.txt';
    const isStockMode = ns.args.includes('stock') || ns.args.includes('stocks');

    if (isStockMode) {
        serverListFile = 'stock-list.txt';
    }

    // Read the list of servers from the selected file
    let data = ns.read(serverListFile);
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Read the list of servers from the stock-list.txt file
    let stockData = ns.read('stock-list.txt');
    let stockServers = stockData.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {
        let maxMoney = ns.getServerMaxMoney(server);

        // Only process servers with a max money greater than 0
        if (maxMoney > 0) {
            let currentMoney = ns.getServerMoneyAvailable(server);
            let moneyPercentage = currentMoney / maxMoney;

            // Determine the number of bars to represent money percentage
            let filledBars = Math.round(moneyPercentage * 20);
            let emptyBars = 20 - filledBars;

            // Create the visual representation
            let visual = '[' + '|'.repeat(filledBars) + '-'.repeat(emptyBars) + ']';

            // Check if the player has root access to the server
            let hasRoot = ns.hasRootAccess(server) ? "Root Access: YES" : "Root Access: NO";

            // Check if this server is in the stock-list.txt and if the script was not run in stock mode
            let stockLabel = '';
            if (!isStockMode && stockServers.includes(server)) {
                stockLabel = ' (stock)';
            }

            // Print the server name, visual bar, numerical percentage, root access info, and stock label
            ns.tprint(`${server}: ${visual} ${(moneyPercentage * 100).toFixed(2)}% - ${hasRoot}${stockLabel}`);
        }
    }
}
