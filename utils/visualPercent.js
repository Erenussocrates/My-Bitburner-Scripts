/** @param {NS} ns */

// Function to generate compressed visual for each server
function generateCompressedVisual(ns, server) {
    let maxMoney = ns.getServerMaxMoney(server);

    // If max money is 0, skip the server
    if (maxMoney <= 0) return '';

    let currentMoney = ns.getServerMoneyAvailable(server);
    let moneyPercentage = currentMoney / maxMoney;

    // Determine the number of bars to represent money percentage
    let filledBars = Math.round(moneyPercentage * 20); // 20 bars total
    let emptyBars = 20 - filledBars;

    // Create the visual representation
    let visual = '[' + '|'.repeat(filledBars) + '-'.repeat(emptyBars) + ']';

    // Return formatted string: "server name: [loading bar] percentage%"
    return `${server}: ${visual} ${(moneyPercentage * 100).toFixed(2)}%`;
}

export async function main(ns) {
    // Determine which file to use based on the argument
    let serverListFile = 'all-list.txt';
    const isStockMode = ns.args.includes('stock') || ns.args.includes('stocks');
    const isCompressed = ns.args.includes('compressed');

    if (isStockMode) {
        serverListFile = 'stock-list.txt';
    }

    // Read the list of servers from the selected file
    let data = ns.read(serverListFile);
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Read the list of servers from the stock-list.txt file
    let stockData = ns.read('stock-list.txt');
    let stockServers = stockData.split('\n').map(s => s.trim()).filter(s => s !== '');

    // In "compressed" mode, we'll print two servers per line
    if (isCompressed) {
        const columnWidth = 50; // Set column width based on the longest expected line
        const separator = "  |  "; // Separator between the two columns

        let outputLines = [];
        for (let i = 0; i < servers.length; i += 2) {
            let leftServer = servers[i];
            let rightServer = servers[i + 1] || ''; // The right column may not always have a server

            // Get visual representation for left server
            let leftVisual = generateCompressedVisual(ns, leftServer);

            // Get visual representation for right server (if it exists)
            let rightVisual = rightServer ? generateCompressedVisual(ns, rightServer) : '';

            // Ensure both visuals are padded to fit the column width
            leftVisual = leftVisual.padEnd(columnWidth, ' ');
            rightVisual = rightVisual.padEnd(columnWidth, ' ');

            // Combine both columns with separator
            outputLines.push(leftVisual + separator + rightVisual);
        }

        // Print the combined lines
        for (let line of outputLines) {
            ns.tprint(line);
        }
    } else {
        // Default behavior (non-compressed mode)
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
}
