/** @param {NS} ns */
export async function main(ns) {

    // Read the list of servers from all-list.txt
    let data = ns.read('all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    let data2 = ns.read('stock-list.txt');
    let stockServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Check and run the hack script on eligible servers
    while(true){
    for (let server of servers) {
        // Check if the server's max money is greater than 0
        if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue; // Skip this server if no root access
        }
        // Check if the server is not in the stockServers list
        if (stockServers.includes(server)) {
                ns.print(`${server} is in the stock list, skipping...`);
                continue; // Skip this server if it's in the stockServers list
        }
        if (ns.getServerMaxMoney(server) > 0) {
          ns.print(`Running hack on ${server}`);
          await ns.hack(server);
        } else {
          ns.print(`${server} has no money, skipping...`);
          continue;
        }
    }
    await ns.sleep(1);
  }
}
