/** @param {NS} ns */
export async function main(ns) {
    const hackScript = 'masterHack.js';
    const hackRam = ns.getScriptRam(hackScript);
    const sleepTime = 1; // Adjust as needed

    let thisServer = ns.getHostname();

    async function analyzeAndHack(server, currentMoney, maxMoney, availableRam, hackFraction) {
        const moneyToHack = currentMoney * hackFraction;
        const hackThreadsNeeded = Math.ceil(ns.hackAnalyzeThreads(server, moneyToHack));

        // Ensure we don't use more threads than available and set minimum of 1 thread if needed
        const hackThreads = Math.max(1, Math.min(hackThreadsNeeded, Math.floor(availableRam / hackRam)));

        if ((hackThreads > 0) && (currentMoney > maxMoney * 0.9)) {
            ns.run(hackScript, hackThreads, server);
            await ns.sleep(sleepTime);
            return availableRam - hackThreads * hackRam;
        }
        return availableRam;
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
        let serverCount = combinedServers.filter(s => ns.getServerMaxRam(s) > 4).length;

        // Calculate hack fraction
        const hackFraction = 0.25 / Math.max(1, serverCount); // Avoid division by zero

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
                let availableRam = ns.getServerMaxRam(thisServer) - ns.getServerUsedRam(thisServer);

                // Perform hacking operation with the dynamically calculated hackFraction
                if (availableRam > 0) {
                    availableRam = await analyzeAndHack(server, currentMoney, maxMoney, availableRam, hackFraction);
                }

                if (availableRam > 0) {
                    ns.print(`Still have ${availableRam.toFixed(2)} GB of RAM available on ${thisServer}.`);
                }

            } else {
                ns.print(`${server} can have no money, skipping...`);
                continue;
            }

            await ns.sleep(sleepTime);
        }
    }
}
