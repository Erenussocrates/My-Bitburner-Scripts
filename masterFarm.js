/** @param {NS} ns */
export async function main(ns) {
    const weakenScript = 'masterWeaken.js';
    const growScript = 'masterGrow.js';
    
    const weakenRam = ns.getScriptRam(weakenScript);
    const growRam = ns.getScriptRam(growScript);

    const sleepTime = 1; // Adjust as needed

    async function analyzeAndWeaken(server, currentSecurity, minSecurity, availableRam) {
        const securityDiff = currentSecurity - minSecurity;
        if (securityDiff > 0) {
            const weakenThreadsNeeded = Math.ceil(securityDiff / ns.weakenAnalyze(1));
            const weakenThreads = Math.min(weakenThreadsNeeded, Math.floor(availableRam / weakenRam));

            if (weakenThreads > 0 && currentSecurity > minSecurity * 1.1) {
                ns.run(weakenScript, weakenThreads, server);
                await ns.sleep(sleepTime);
                return availableRam - weakenThreads * weakenRam;
            }
        }
        return availableRam;
    }

    async function analyzeAndGrow(server, currentMoney, maxMoney, availableRam) {
        const growthRate = ns.getServerGrowth(server) / 100; // Convert percentage to decimal
        const moneyNeeded = maxMoney - currentMoney; // Calculate how much more money is needed

        if (currentMoney < maxMoney) {
            // Calculate the required number of grow threads
            const growthMultiplier = 1 / (1 - growthRate); // Growth multiplier per thread
            const requiredMultiplier = maxMoney / currentMoney; // Desired multiplier to reach maxMoney
            const growThreadsNeeded = Math.ceil(Math.log(requiredMultiplier) / Math.log(growthMultiplier));

            const growThreads = Math.min(growThreadsNeeded, Math.floor(availableRam / growRam));

            if (growThreads > 0) {
                ns.run(growScript, growThreads, server);
                await ns.sleep(sleepTime);
                ns.print(`Server: ${server}, Money Needed: ${ns.formatNumber(Number(moneyNeeded), 3)}, Grow Threads: ${growThreads}`);
                return availableRam - growThreads * growRam;
            }
        }
        return availableRam;
    }

    while (true) {
        let servers;
        let isStockMode = ns.args.includes("stock");

        if (isStockMode) {
            let data2 = ns.read('stock-list.txt');
            servers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');
        } else {
            let data = ns.read('all-list.txt');
            servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

            let data2 = ns.read('stock-list.txt');
            let stockServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

            // Exclude stock servers
            servers = servers.filter(server => !stockServers.includes(server));
        }

        for (let server of servers) {
            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue;
            }

            if (ns.getServerMaxMoney(server) > 0) {
                let minSecurity = ns.getServerMinSecurityLevel(server);
                let maxMoney = ns.getServerMaxMoney(server);
                let currentSecurity = ns.getServerSecurityLevel(server);
                let currentMoney = ns.getServerMoneyAvailable(server);
                let availableRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) - 100;

                // Perform weaken and grow operations, adjusting available RAM as each completes
                if (availableRam > 0) {
                    availableRam = await analyzeAndWeaken(server, currentSecurity, minSecurity, availableRam);
                }
                if (availableRam > 0) {
                    availableRam = await analyzeAndGrow(server, currentMoney, maxMoney, availableRam);
                }
                if (availableRam > 0) {
                    ns.print(`Still have ${availableRam.toFixed(2)} GB of RAM available on ${ns.getHostname()}.`);
                }

            } else {
                ns.print(`${server} can have no money, skipping...`);
            }

            await ns.sleep(sleepTime);
        }
    }
}
