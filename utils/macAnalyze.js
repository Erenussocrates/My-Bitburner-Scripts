/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from all-list.txt
    let data = ns.read('actual-all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Define the maximum length for alignment based on the longest string (the horizontal separator)
    const maxLineLength = '----------------------------------------'.length;

    // Function to pad a string with spaces until it matches maxLineLength
    function padString(str) {
        return str + ' '.repeat(maxLineLength - str.length);
    }

    // Function to gather server information in an array of 10 padded strings
    function gatherServerInfo(server) {
        let minSecurity = ns.getServerMinSecurityLevel(server);
        let maxMoney = Number(ns.getServerMaxMoney(server));
        let currentSecurity = ns.getServerSecurityLevel(server);
        let currentMoney = Number(ns.getServerMoneyAvailable(server));
        let maxRam = ns.getServerMaxRam(server);
        let usedRam = ns.getServerUsedRam(server);
        let hasRoot = ns.hasRootAccess(server);
        let growthRate = ns.getServerGrowth(server);

        // Return the padded server information
        return [
            padString(`Server: ${server}`),
            padString(`Root Access: ${hasRoot ? 'Yes' : 'No'}`),
            padString(`Current Money: ${ns.formatNumber(currentMoney, 3)}`),
            padString(`Max Money: ${ns.formatNumber(maxMoney, 3)}`),
            padString(`Current Security Level: ${ns.formatNumber(currentSecurity, 3)}`),
            padString(`Min Security Level: ${minSecurity}`),
            padString(`RAM Usage: ${usedRam.toFixed(2)} / ${maxRam.toFixed(2)} GB`),
            padString(`Current Money Percentage: ${(100 * currentMoney / maxMoney).toFixed(2)} %`),
            padString(`Growth Rate: ${growthRate}`),
            '----------------------------------------'
        ];
    }

    // Prepare the output rows
    let outputRows = [];
    let rowBuffer = [];

    for (let i = 0; i < servers.length; i++) {
        let serverInfo = gatherServerInfo(servers[i]);
        rowBuffer.push(serverInfo);

        // If rowBuffer reaches 3 servers or it's the last server, format the row
        if (rowBuffer.length === 3 || i === servers.length - 1) {
            // Build the combined rows for the current set of 1 to 3 servers
            for (let row = 0; row < 10; row++) {
                // Join the current row from each server's info, adding the column separator
                let line = rowBuffer.map(server => server[row]).join(" | ");
                outputRows.push(line);
            }
            rowBuffer = [];
        }

        // Adding a small delay to avoid spamming
        await ns.sleep(100);
    }

    // Print the accumulated rows with server info in 3 columns
    for (let row of outputRows) {
        ns.tprint(row);
    }
}
