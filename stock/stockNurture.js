/** @param {NS} ns */
export async function main(ns) {
    //const weakenScript = 'master/masterWeaken.js';
    const growScript = 'stock/stockGrow.js';

    //const weakenRam = ns.getScriptRam(weakenScript);
    const growRam = ns.getScriptRam(growScript);

    const sleepTime = 2; // Adjust as needed

    /*async function analyzeAndWeaken(server, currentSecurity, minSecurity, stockRAM) {
        const securityDiff = currentSecurity - minSecurity;
        if (securityDiff > 0) {
            const weakenThreadsNeeded = Math.ceil(securityDiff / ns.weakenAnalyze(1));
            const weakenThreads = Math.min(weakenThreadsNeeded, Math.floor(stockRAM / weakenRam));

            if (weakenThreads > 0 && currentSecurity > minSecurity * 1.1) {
                ns.run(weakenScript, weakenThreads, server);
                await ns.sleep(sleepTime);
            }
        }
    }*/

    async function analyzeAndGrow(server, currentMoney, maxMoney, stockRAM) {
        const growthRate = ns.getServerGrowth(server) / 100;
        const moneyNeeded = maxMoney - currentMoney;

        if (currentMoney < maxMoney) {
            const growthMultiplier = 1 / (1 - growthRate);
            const requiredMultiplier = maxMoney / currentMoney;
            const growThreadsNeeded = Math.ceil(Math.log(requiredMultiplier) / Math.log(growthMultiplier));
            const growThreads = Math.min(growThreadsNeeded, Math.floor(stockRAM / growRam));

            if (growThreads > 0) {
                ns.run(growScript, growThreads, server);
                await ns.sleep(sleepTime);
                ns.print(`Server: ${server}, Money Needed: ${ns.formatNumber(Number(moneyNeeded), 3)}, Grow Threads: ${growThreads}`);
            }
        }
    }

    while (true) {
        const data = ns.read('stock-list.txt');
        const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

        const stockRAM = parseFloat(ns.readPort(2)); // Read the RAM allocation from port 2

        let allAtMaxMoneyAndMinSecurity = true;

        for (let server of servers) {
            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue;
            }

            //let minSecurity = ns.getServerMinSecurityLevel(server);
            let maxMoney = ns.getServerMaxMoney(server);
            //let currentSecurity = ns.getServerSecurityLevel(server);
            let currentMoney = ns.getServerMoneyAvailable(server);

            /*if (stockRAM > 0) {
                await analyzeAndWeaken(server, currentSecurity, minSecurity, stockRAM);
            }*/
            if (stockRAM > 0) {
                await analyzeAndGrow(server, currentMoney, maxMoney, stockRAM);
            }

            if (currentMoney < maxMoney) {
                allAtMaxMoneyAndMinSecurity = false;
            }

            if (stockRAM > 0) {
                ns.print(`Still have ${stockRAM.toFixed(2)} GB of RAM available on ${ns.getHostname()}.`);
            }

            await ns.sleep(sleepTime);
        }

        if (allAtMaxMoneyAndMinSecurity) {
            ns.print("All servers have max money. Terminating script.");
            ns.exit();
        }

        await ns.sleep(sleepTime);
    }
}
