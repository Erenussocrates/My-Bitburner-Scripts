/** @param {NS} ns */
export async function main(ns) {
    const hackScript = 'client/masterHack.js';
    const hackRam = ns.getScriptRam(hackScript);
    const sleepTime = 1; // Adjust as needed

    async function analyzeAndHack(server, currentMoney, maxMoney, hackFraction, masterRAM) {
        const moneyToHack = currentMoney * hackFraction;
        const hackThreadsNeeded = Math.ceil(ns.hackAnalyzeThreads(server, moneyToHack));

        // Ensure we don't use more threads than available and set minimum of 1 thread if needed
        const hackThreads = Math.max(1, Math.min(hackThreadsNeeded, Math.floor(masterRAM / hackRam)));

        if (hackThreads > 0 && currentMoney > maxMoney * 0.9) {
            ns.run(hackScript, hackThreads, server);
            await ns.sleep(sleepTime);
        }
    }

    while (true) {
        let allServersData = ns.read('all-list.txt');
        let allServers = allServersData.split('\n').map(s => s.trim()).filter(s => s !== '');

        let stockServersData = ns.read('stock-list.txt');
        let stockServers = stockServersData.split('\n').map(s => s.trim()).filter(s => s !== '');

        let myOwnServersData = ns.read('myOwnServers.txt');
        let myOwnServers = myOwnServersData.split('\n').map(s => s.trim()).filter(s => s !== '');
        // Combine all servers and my own servers into one list for counting
        let combinedServers = [...new Set([...allServers, ...myOwnServers])];
        // Count servers with more than 4 GB of RAM
        let serverCount = combinedServers.filter(s => ns.getServerMaxRam(s) > 8).length;

        // Calculate hack fraction
        const hackFraction = 0.25 / Math.max(1, serverCount); // Avoid division by zero

        const masterRAM = parseFloat(ns.readPort(3)); // Read the RAM allocation from port 3

        for (let server of allServers) {
            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue;
            }

            if (stockServers.includes(server)) {
                ns.print(`${server} is in the stock list, skipping...`);
                continue;
            }

            if (ns.getServerMaxMoney(server) > 0) {
                let maxMoney = ns.getServerMaxMoney(server);
                let currentMoney = ns.getServerMoneyAvailable(server);

                if (masterRAM > 0 && server !== "n00dles") {
                    await analyzeAndHack(server, currentMoney, maxMoney, hackFraction, masterRAM);
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
