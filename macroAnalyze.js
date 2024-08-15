/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from all-list.txt
    let data = ns.read('all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {
        // Gather server information
        let minSecurity = ns.getServerMinSecurityLevel(server);
        let maxMoney = Number(ns.getServerMaxMoney(server));
        let currentSecurity = ns.getServerSecurityLevel(server);
        let currentMoney = Number(ns.getServerMoneyAvailable(server));
        let maxRam = ns.getServerMaxRam(server);
        let usedRam = ns.getServerUsedRam(server);
        let hasRoot = ns.hasRootAccess(server);
        let growthRate = ns.getServerGrowth(server);

        // Print the server information
        ns.tprint(`Server: ${server}`);
        ns.tprint(`Root Access: ${hasRoot ? 'Yes' : 'No'}`);
        //ns.tprint(`Current Money: ${ns.nFormat(currentMoney, '$0.000a')}`);
        ns.tprint(`Current Money: ${ns.formatNumber(currentMoney, 3)}`);
        //ns.tprint(`Max Money: ${ns.nFormat(maxMoney, '$0.000a')}`);
        ns.tprint(`Max Money: ${ns.formatNumber(maxMoney, 3)}`);
        ns.tprint(`Current Security Level: ${currentSecurity}`);
        ns.tprint(`Min Security Level: ${minSecurity}`);
        ns.tprint(`RAM Usage: ${usedRam.toFixed(2)} / ${maxRam.toFixed(2)} GB`);
        ns.tprint(`Current Money Percentage: ${(100 * currentMoney / maxMoney).toFixed(2)} %`);
        ns.tprint(`Growth Rate: ${growthRate}`);
        ns.tprint('-----------------------------------');

        // Adding a delay to avoid spamming
        await ns.sleep(100);
    }
}
