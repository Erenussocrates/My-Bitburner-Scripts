/** @param {NS} ns */
export async function main(ns) {

  while (true) {
    let data = ns.read('combined-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {

            if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue; // Skip this server if no root access
            }

            let maxMoney = ns.getServerMaxMoney(server);
            let currentMoney = ns.getServerMoneyAvailable(server);

            if (currentMoney >= maxMoney*0.9){
              await ns.hack(server);
              await ns.sleep(2000);
            }

        }
  }

}
