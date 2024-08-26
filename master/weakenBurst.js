/** @param {NS} ns */
export async function main(ns) {

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
        let minSecurity = ns.getServerMinSecurityLevel(server);
        let currentSecurity = ns.getServerSecurityLevel(server);
        
        if (!ns.hasRootAccess(server)) {
            ns.print(`No root access to ${server}, skipping...`);
            continue;
        }
        if (currentSecurity >= minSecurity * 1.1) {
            ns.run('master/masterWeaken.js', 100, server);
            await ns.sleep(100);
        } else {
            ns.print(`${server} already has low security, skipping...`);
            continue;
        }
    }
}
