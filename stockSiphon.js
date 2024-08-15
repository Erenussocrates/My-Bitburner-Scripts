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
            return this.currentMoney >= this.maxMoney*0.0001;
        }

        shouldWeaken() {
            return this.currentSecurity > this.minSecurity * 1.1;
        }
    }

    const serverList = [];

    // Read the server names from 'stock-list.txt'
    const data = ns.read('stock-list.txt');
    const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    // Initialize server data structures
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            const maxMoney = ns.getServerMaxMoney(server);
            const currentMoney = ns.getServerMoneyAvailable(server);
            const minSecurity = ns.getServerMinSecurityLevel(server);
            const currentSecurity = ns.getServerSecurityLevel(server);
            serverList.push(new ServerData(server, maxMoney, currentMoney, minSecurity, currentSecurity));
        } else {
            ns.print(`No root access to ${server}, skipping...`);
        }
    }

    // Main loop
    while (serverList.some(server => server.shouldHack() || server.shouldWeaken())) {
        for (const serverData of serverList) {
            serverData.updateCurrentState(ns);

            // Check if there's enough free RAM to run the hack or weaken scripts
            const freeRAM = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')-100;
            //const hackRAMCost = ns.getScriptRam('stockHack.js');
            //const weakenRAMCost = ns.getScriptRam('stockWeaken.js');

            if (serverData.shouldWeaken() && freeRAM >0) {
                ns.run("stockWeaken.js", 100, serverData.name);
                await ns.sleep(1);
            }

            if (serverData.shouldHack() && freeRAM >0) {
                ns.run("stockHack.js", 100, serverData.name);
                await ns.sleep(1);
            }
        }

        await ns.sleep(100); // Pause before the next loop iteration to avoid overwhelming the system
    }

    ns.print("Exiting, no servers meet the hacking or weakening criteria.");
}
