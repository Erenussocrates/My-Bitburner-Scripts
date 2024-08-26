/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from 'all-list.txt'
    let serverListData = ns.read('all-list.txt');
    let servers = serverListData.split('\n').map(s => s.trim()).filter(s => s !== '');

    // The script to be checked and re-run
    const scriptName = 'client/stockSiphon.js';

    for (let server of servers) {
        if (!ns.serverExists(server)) {
            ns.print(`Server ${server} does not exist. Skipping...`);
            continue;
        }

        // Check if the script exists on the server
        if (ns.fileExists(scriptName, server)) {
            // Kill any running instances of the script on the server
            if (ns.isRunning(scriptName, server)) {
                ns.kill(scriptName, server);
                ns.print(`Killed previous instance of ${scriptName} on ${server}.`);
            }

            // Re-run the script on the server
            ns.exec(scriptName, server);
            ns.print(`Re-ran ${scriptName} on ${server}.`);
        } else {
            ns.print(`Script ${scriptName} does not exist on ${server}. Skipping...`);
        }

        await ns.sleep(1); // Optional sleep to avoid overloading the network
    }
}
