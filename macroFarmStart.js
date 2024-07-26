/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from all-list.txt

    async function jumpstart(server) {
        if (ns.fileExists('payday.js', server)) {
            ns.scriptKill('payday.js', server);
            ns.exec('payday.js', server);
        } else {
            ns.print(`payday.js not found on ${server}`);
        }

        if (ns.fileExists('masterFarm.js', server)) {
            ns.scriptKill('masterFarm.js', server);
            ns.exec('masterFarm.js', server);
        } else {
            ns.print(`masterFarm.js not found on ${server}`);
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
