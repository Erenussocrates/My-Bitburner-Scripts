/** @param {NS} ns */
export async function main(ns) {
    //const weakenScript = 'client/stockWeaken.js';
    const hackScript = 'client/stockHack.js';

    //const weakenRam = ns.getScriptRam(weakenScript);
    const hackRam = ns.getScriptRam(hackScript);

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

    async function analyzeAndHack(server, currentMoney, maxMoney, stockRAM) {
        if (currentMoney > 0) {
            const hackPercent = ns.hackAnalyze(server);
            const hackThreadsNeeded = Math.ceil((currentMoney / maxMoney) / hackPercent);
            const hackThreads = Math.min(hackThreadsNeeded, Math.floor(stockRAM / hackRam));

            if (hackThreads > 0 && currentMoney > maxMoney * 0.0001) {
                ns.run(hackScript, hackThreads, server);
                await ns.sleep(sleepTime);
                ns.print(`Server: ${server}, Current Money: ${ns.formatNumber(Number(currentMoney), 3)}, Hack Threads: ${hackThreads}`);
            }
        }
    }

    while (true) {
        const data = ns.read('stock-list.txt');
        const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

        const stockRAM = parseFloat(ns.readPort(4)); // Read the RAM allocation from port 4

        let allAtMinMoneyAndMinSecurity = true;

        for (let server of servers) {
            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue;
            }

            //let minSecurity = ns.getServerMinSecurityLevel(server);
            //let currentSecurity = ns.getServerSecurityLevel(server);
            let currentMoney = ns.getServerMoneyAvailable(server);
            let maxMoney = ns.getServerMaxMoney(server);

            /*if (stockRAM > 0) {
                await analyzeAndWeaken(server, currentSecurity, minSecurity, stockRAM);
            }*/
            if (stockRAM > 0) {
                await analyzeAndHack(server, currentMoney, maxMoney, stockRAM);
            }

            if (currentMoney > maxMoney * 0.0001) {
                allAtMinMoneyAndMinSecurity = false;
            }

            if (stockRAM > 0) {
                ns.print(`Still have ${stockRAM.toFixed(2)} GB of RAM available on ${ns.getHostname()}.`);
            }

            await ns.sleep(sleepTime);
        }

        if (allAtMinMoneyAndMinSecurity) {
            ns.print("All servers have minimal money. Terminating script.");
            ns.exit();
        }

        await ns.sleep(sleepTime);
    }
}
