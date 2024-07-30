/** @param {NS} ns */
export async function main(ns) {
    class ServerData {
        constructor(name, maxMoney, currentMoney, minSecurity, currentSecurity) {
            this.name = name;
            this.maxMoney = maxMoney;
            this.currentMoney = currentMoney;
            this.minSecurity = minSecurity;
            this.currentSecurity = currentSecurity;
        }

        updateCurrentState(ns) {
            this.currentMoney = ns.getServerMoneyAvailable(this.name);
            this.currentSecurity = ns.getServerSecurityLevel(this.name);
        }

        shouldHack() {
            return this.currentMoney >= this.maxMoney * 0.1;
        }

        shouldWeaken() {
            return this.currentSecurity > this.minSecurity * 1.1;
        }
    }

    let serverList = [];

    // Read the server names from 'stock-list.txt'
    let data = ns.read('stock-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Initialize server data structures
    for (let server of servers) {
        if (ns.hasRootAccess(server)) {
            let maxMoney = ns.getServerMaxMoney(server);
            let currentMoney = ns.getServerMoneyAvailable(server);
            let minSecurity = ns.getServerMinSecurityLevel(server);
            let currentSecurity = ns.getServerSecurityLevel(server);
            serverList.push(new ServerData(server, maxMoney, currentMoney, minSecurity, currentSecurity));
        } else {
            ns.print(`No root access to ${server}, skipping...`);
        }
    }

    // Main loop
    while (serverList.some(server => server.shouldHack() || server.shouldWeaken())) {
        for (let serverData of serverList) {
            serverData.updateCurrentState(ns);

            if (serverData.shouldWeaken()) {
                await ns.weaken(serverData.name, { stock: true });
                await ns.sleep(2000);
            }

            if (serverData.shouldHack()) {
                await ns.hack(serverData.name, { stock: true });
                await ns.sleep(2000);
            }
        }
    }

    ns.print("Exiting, no servers meet the hacking or weakening criteria.");
}
