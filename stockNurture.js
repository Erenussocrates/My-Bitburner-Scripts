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

    const serverList = [];

    // Read the server names from 'stock-list.txt'
    const data = ns.read('stock-list.txt');
    const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Initialize server data structures
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            const minSecurity = ns.getServerMinSecurityLevel(server);
            const maxMoney = ns.getServerMaxMoney(server);
            const currentSecurity = ns.getServerSecurityLevel(server);
            const currentMoney = ns.getServerMoneyAvailable(server);
            serverList.push(new ServerData(server, minSecurity, maxMoney, currentSecurity, currentMoney));
        } else {
            ns.print(`No root access to ${server}, skipping...`);
        }
    }

    // Main loop
    while (serverList.some(server => server.needsGrow() || server.needsWeaken())) {
        for (const serverData of serverList) {
            serverData.updateCurrentState(ns);

            // Check if there's enough free RAM to run the grow or weaken scripts
            const freeRAM = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')-100;
            //const growRAMCost = ns.getScriptRam('stockGrow.js');
            //const weakenRAMCost = ns.getScriptRam('masterWeaken.js');

            if (serverData.needsGrow() && freeRAM > 0) {
                ns.run("stockGrow.js", 100, serverData.name);
                await ns.sleep(1);
            }

            if (serverData.needsWeaken() && freeRAM > 0) {
                ns.run("masterWeaken.js", 100, serverData.name);
                await ns.sleep(1);
            }
        }

        await ns.sleep(100); // Pause before the next loop iteration to avoid overwhelming the system
    }

    ns.print("Exiting, no servers need growing or weakening.");
}
