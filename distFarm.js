/** @param {NS} ns */
export async function main(ns) {

    async function copyfiles(server) {
        ns.scp('masterFarm.js', server, 'home');
        ns.scp('masterGrow.js', server, 'home');
        ns.scp('masterWeaken.js', server, 'home');
    }

    async function lowball(server) {
      ns.scp('payday.js', server, 'home');
    }

    let data = ns.read('distribution-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {

        if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue; // Skip this server if no root access
            }
        
        ns.scp('combined-list.txt', server, 'home');

        let maxRam = ns.getServerMaxRam(server);
        if (maxRam <= 8) {
            await lowball(server);
        } else {
            await copyfiles(server);
        }
    }

    let data2 = ns.read('myOwnServers.txt');
    let myServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of myServers) {
        ns.scp('combined-list.txt', server, 'home');
        let maxRam = ns.getServerMaxRam(server);
        if (maxRam <= 8) {
            await lowball(server);
        } else {
            await copyfiles(server);
        }
    }
}
