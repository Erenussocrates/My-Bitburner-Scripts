/** @param {NS} ns */
export async function main(ns) {
    const weakenScript = 'master/masterWeaken.js';
    const growScript = 'master/masterGrow.js';

    const weakenRam = ns.getScriptRam(weakenScript);
    const growRam = ns.getScriptRam(growScript);

    const sleepTime = 2; // Adjust as needed

    async function analyzeAndWeaken(server, currentSecurity, minSecurity, masterRAM) {
        const securityDiff = currentSecurity - minSecurity;
        if (securityDiff > 0) {
            const weakenThreadsNeeded = Math.ceil(securityDiff / ns.weakenAnalyze(1));
            const weakenThreads = Math.min(weakenThreadsNeeded, Math.floor(masterRAM / weakenRam));

            if (weakenThreads > 0 && currentSecurity > minSecurity * 1.1) {
                ns.run(weakenScript, weakenThreads, server);
                await ns.sleep(sleepTime);
            }
        }
    }

    async function analyzeAndGrow(server, currentMoney, maxMoney, masterRAM) {
        const growthRate = ns.getServerGrowth(server) / 100;
        const moneyNeeded = maxMoney - currentMoney;

        if (currentMoney < maxMoney) {
          if (server === "n00dles") {
            ns.run(growScript, 1, server);
            await ns.sleep(sleepTime);
          }
          else {
            const growthMultiplier = 1 / (1 - growthRate);
            const requiredMultiplier = maxMoney / currentMoney;
            const growThreadsNeeded = Math.ceil(Math.log(requiredMultiplier) / Math.log(growthMultiplier));
            const growThreads = Math.min(growThreadsNeeded, Math.floor(masterRAM / growRam));

            if (growThreads > 0) {
                ns.run(growScript, growThreads, server);
                await ns.sleep(sleepTime);
                ns.print(`Server: ${server}, Money Needed: ${ns.formatNumber(Number(moneyNeeded), 3)}, Grow Threads: ${growThreads}`);
            }
          }
        }
    }

    while (true) {
        let servers;
        let stockServers = []; // Initialize stockServers here to avoid undefined errors
        let isStockMode = ns.args.includes("stock");

        if (isStockMode) {
            let data = ns.read('stock-list.txt');
            servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');
        } else {
            let data = ns.read('all-list.txt');
            servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

            let data2 = ns.read('stock-list.txt');
            stockServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

            //servers = servers.filter(server => !stockServers.includes(server));
        }

        const masterRAM = parseFloat(ns.readPort(1)); // Read the RAM allocation from port 1

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

                if (masterRAM > 0) {
                    await analyzeAndWeaken(server, currentSecurity, minSecurity, masterRAM);
                }
                
                if (isStockMode) {
                    if (masterRAM > 0) {
                        await analyzeAndGrow(server, currentMoney, maxMoney, masterRAM);
                    }
                } else {
                    if (masterRAM > 0 && !stockServers.includes(server)) {
                        await analyzeAndGrow(server, currentMoney, maxMoney, masterRAM);
                    }
                }

                if (masterRAM > 0) {
                    ns.print(`Still have ${masterRAM.toFixed(2)} GB of RAM available on ${ns.getHostname()}.`);
                }
            } else {
                ns.print(`${server} can have no money, skipping...`);
            }

            await ns.sleep(sleepTime);
        }
    }
}
