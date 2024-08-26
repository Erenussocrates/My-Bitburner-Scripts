/** @param {NS} ns */
export async function main(ns) {
    while (true) {

        let thisServer = ns.getHostname();

        const maxRam = ns.getServerMaxRam(thisServer);
        const usedRam = ns.getServerUsedRam(thisServer);
        const initialRam = maxRam - 5.7;
        const totalRAM = initialRam - usedRam;

        const sleepTime = 1;

        if (totalRAM <= 0) {
            ns.print("No RAM available.");
            await ns.sleep(sleepTime);
            continue;
        }

        let masterFarmRunning = ns.isRunning('client/clientFarm.js', thisServer);
        //let stockNurtureRunning = ns.isRunning('stock/stockNurture.js', 'home');
        let stockSiphonRunning = ns.isRunning('client/stockSiphon.js', thisServer);

        let masterRAM = 0;
        let stockRAM = 0;

        if (masterFarmRunning && stockSiphonRunning) {
            // Count servers with money from all-list.txt and check for root access
            let allData = ns.read('all-list.txt');
            let allServers = allData.split('\n').map(s => s.trim()).filter(s => s !== '');
            let allServerCountWMoney = allServers.filter(s => ns.getServerMaxMoney(s) > 0 && ns.hasRootAccess(s)).length;

            // Count all servers in stock-list.txt and check for root access
            let stockData = ns.read('stock-list.txt');
            let stockServers = stockData.split('\n').map(s => s.trim()).filter(s => s !== '');
            let stockServerCount = stockServers.filter(s => ns.hasRootAccess(s)).length;

            if (allServerCountWMoney > 0) {
                masterRAM = totalRAM * ((allServerCountWMoney - stockServerCount) / allServerCountWMoney);
                stockRAM = totalRAM * (stockServerCount / allServerCountWMoney);
            }
        } else if (masterFarmRunning) {
            masterRAM = totalRAM;
        } else if (stockSiphonRunning) {
            stockRAM = totalRAM;
        }
        else{
            ns.print("None of the scripts are running yet.");
        }

        // Pass the RAM values to the respective scripts
        if (masterFarmRunning) {
            ns.writePort(3, masterRAM.toString());
        }
        if (stockSiphonRunning) {
            ns.writePort(4, stockRAM.toString());
        }

        await ns.sleep(sleepTime); // Sleep for a bit before recalculating
    }
}
