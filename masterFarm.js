/** @param {NS} ns */
export async function main(ns) {
    const weakenThreads = 5;
    const growThreads = weakenThreads * 2;

    async function analyzeAndWeaken(server, currentSecurity, minSecurity, weakenThreads) {
        if (currentSecurity >= minSecurity * 1.1) {
            ns.run('masterWeaken.js', weakenThreads, server);
            await ns.sleep(2000);
        }
    }

    while (true) {
        // Read the list of servers from the local combined-list.txt
        let data = ns.read('combined-list.txt');
        let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

        for (let server of servers) {
            // Check if we have root access to the server
            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue; // Skip this server if no root access
            }

            // Gather server information
            let minSecurity = ns.getServerMinSecurityLevel(server);
            let maxMoney = ns.getServerMaxMoney(server);
            let currentSecurity = ns.getServerSecurityLevel(server);
            let currentMoney = ns.getServerMoneyAvailable(server);

            // If the server's current money is less than its max money, run masterGrow.js
            if (maxMoney > currentMoney) {
                ns.run('masterGrow.js', growThreads, server);
                await ns.sleep(2000);
            }

            // Analyze and weaken the server if necessary
            await analyzeAndWeaken(server, currentSecurity, minSecurity, weakenThreads);
        }
    }
}
