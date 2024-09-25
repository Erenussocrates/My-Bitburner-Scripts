/** @param {NS} ns */
export async function main(ns) {
    while (true) {

      // Check if "master/ipvgo.js" is running on "home"
    let ipvgoRunning = ns.isRunning('master/ipvgo.js', 'home');

    // If not running, execute the script
    if (!ipvgoRunning) {
        // Determine which opponent to reset the board against
const opponents = ["Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati"];
const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

// Reset the board state with the randomly chosen opponent
ns.go.resetBoardState(randomOpponent, 13);

// Start the new game
ns.exec('master/ipvgo.js', "home");
    }

        /*
        const maxRam = ns.getServerMaxRam('home');
        const usedRam = ns.getServerUsedRam('home');
        const availableRam = maxRam - usedRam;
        const totalRAM = availableRam - maxRam * 0.01;
        */
        
        const maxRam = ns.getServerMaxRam('home');
        const usedRam = ns.getServerUsedRam('home');
        const initialRam = maxRam - maxRam * 0.01 - 20;
        const totalRAM = initialRam - usedRam;

        const sleepTime = 1;

        if (totalRAM <= 0) {
            ns.print("No RAM available after reserving 1% of maximum RAM.");
            await ns.sleep(sleepTime);
            continue;
        }

        let masterFarmRunning = ns.isRunning('master/masterFarm.js', 'home');
        let stockNurtureRunning = ns.isRunning('stock/stockNurture.js', 'home');
        //let stockSiphonRunning = ns.isRunning('stockSiphon.js', 'home');

        let masterRAM = 0;
        let stockRAM = 0;

        if (masterFarmRunning && stockNurtureRunning) {
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
        } else if (stockNurtureRunning) {
            stockRAM = totalRAM;
        }
        else{
            ns.print("None of the scripts are running yet.");
        }

        // Pass the RAM values to the respective scripts
        if (masterFarmRunning) {
            ns.writePort(1, masterRAM.toString());
        }
        if (stockNurtureRunning) {
            ns.writePort(2, stockRAM.toString());
        }

        await ns.sleep(sleepTime); // Sleep for a bit before recalculating
    }
}
