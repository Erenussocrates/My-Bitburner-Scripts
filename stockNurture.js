/** @param {NS} ns */
export async function main(ns) {
    class ServerData {
        constructor(name, minSecurity, maxMoney, currentSecurity, currentMoney) {
            this.name = name;
            this.minSecurity = minSecurity;
            this.maxMoney = maxMoney;
            this.currentSecurity = currentSecurity;
            this.currentMoney = currentMoney;
        }

        updateCurrentState(ns) {
            this.currentSecurity = ns.getServerSecurityLevel(this.name);
            this.currentMoney = ns.getServerMoneyAvailable(this.name);
        }

        needsGrow() {
            return this.currentMoney < this.maxMoney;
        }

        needsWeaken() {
            return this.currentSecurity >= this.minSecurity * 1.1;
        }
    }

    let serverList = [];

    // Read the server names from 'stock-list.txt'
    let data = ns.read('stock-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Initialize server data structures
    for (let server of servers) {
        if (ns.hasRootAccess(server)) {
            let minSecurity = ns.getServerMinSecurityLevel(server);
            let maxMoney = ns.getServerMaxMoney(server);
            let currentSecurity = ns.getServerSecurityLevel(server);
            let currentMoney = ns.getServerMoneyAvailable(server);
            serverList.push(new ServerData(server, minSecurity, maxMoney, currentSecurity, currentMoney));
        } else {
            ns.print(`No root access to ${server}, skipping...`);
        }
    }

    // Main loop
    while (serverList.some(server => server.needsGrow() || server.needsWeaken())) {
        for (let serverData of serverList) {
            serverData.updateCurrentState(ns);

            if (serverData.needsGrow()) {
                await ns.grow(serverData.name, { stock: true });
                await ns.sleep(2000);
            }

            if (serverData.needsWeaken()) {
                await ns.weaken(serverData.name);
                await ns.sleep(2000);
            }
        }
    }

    ns.print("Exiting, no servers need growing or weakening.");
}
