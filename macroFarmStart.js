/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from all-list.txt

    async function jumpstart(server) {
        const paydayScript = 'payday.js';
        const masterFarmScript = 'masterFarm.js';

        if (ns.fileExists(paydayScript, server)) {
            ns.scriptKill(paydayScript, server);

            // Calculate maximum number of threads for payday.js
            let maxRam = ns.getServerMaxRam(server);
            let usedRam = ns.getServerUsedRam(server);
            let freeRam = maxRam - usedRam;
            let paydayRam = ns.getScriptRam(paydayScript);
            let maxThreads = Math.floor(freeRam / paydayRam);

            // Execute with max threads, fallback to 1 thread if not enough RAM
            if (maxThreads > 0) {
                ns.exec(paydayScript, server, maxThreads);
            } else {
                ns.print(`Not enough free RAM to run ${paydayScript} on ${server}`);
            }
        } else {
            ns.print(`${paydayScript} not found on ${server}`);
        }

        if (ns.fileExists(masterFarmScript, server)) {
            ns.scriptKill(masterFarmScript, server);
            ns.exec(masterFarmScript, server);
        } else {
            ns.print(`${masterFarmScript} not found on ${server}`);
        }
    }

    let data = ns.read('all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {
        if (!ns.hasRootAccess(server)) {
            ns.print(`No root access to ${server}, skipping...`);
            continue; // Skip this server if no root access
        }

        await jumpstart(server);
    }

    let data2 = ns.read('myOwnServers.txt');
    let myServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of myServers) {
        await jumpstart(server);
    }
}
