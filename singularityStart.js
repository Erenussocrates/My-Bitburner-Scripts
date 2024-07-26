/* WE WILL USE THIS AFTER WE FINISH BITNODE-4 */

/** @param {NS} ns */

//The one below is for accessing servers in the list sequentially:

/*
export async function main(ns) {
    // List of programs and corresponding Singularity functions
    const programs = [
        { name: "BruteSSH.exe", fn: ns.singularity.brutessh },
        { name: "FTPCrack.exe", fn: ns.singularity.ftpcrack },
        { name: "relaySMTP.exe", fn: ns.singularity.relaysmtp },
        { name: "HTTPWorm.exe", fn: ns.singularity.httpworm },
        { name: "SQLInject.exe", fn: ns.singularity.sqlinject }
    ];

    // Read the list of servers from the local all-list.txt
    const data = ns.read('all-list.txt');
    const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (const server of servers) {
        ns.print(`Attempting to gain access to ${server}`);

        if (!ns.serverExists(server)) {
            ns.print(`ERROR: Server ${server} does not exist!`);
            continue;
        }

        // Check if the server already has root access
        if (ns.hasRootAccess(server)) {
            ns.print(`Already have root access to ${server}`);
            continue;
        }

        // Run hacking programs if they exist
        for (const program of programs) {
            if (ns.fileExists(program.name, 'home')) {
                ns.print(`Running ${program.name} on ${server}`);
                await program.fn(server);  // Await the execution of the function
            }
        }

        // Run NUKE.exe if possible
        if (ns.getServerNumPortsRequired(server) <= ns.getServer(server).openPortCount) {
            ns.print(`Running NUKE.exe on ${server}`);
            ns.singularity.nuke(server);
        }

        // Check if we have root access after running the programs
        if (ns.hasRootAccess(server)) {
            ns.print(`Root access gained on ${server}`);
            ns.print(`Installing backdoor on ${server}`);
            await ns.singularity.installBackdoor(server);
        } else {
            ns.print(`Failed to gain root access on ${server}`);
        }
    }

    ns.print("Automation complete.");
}
*/

//The one below is for accessing servers concurrently:

/*export async function main(ns) {
    // List of programs and corresponding Singularity functions
    const programs = [
        { name: "BruteSSH.exe", fn: ns.singularity.brutessh },
        { name: "FTPCrack.exe", fn: ns.singularity.ftpcrack },
        { name: "relaySMTP.exe", fn: ns.singularity.relaysmtp },
        { name: "HTTPWorm.exe", fn: ns.singularity.httpworm },
        { name: "SQLInject.exe", fn: ns.singularity.sqlinject }
    ];

    // Read the list of servers from the local all-list.txt
    const data = ns.read('all-list.txt');
    const servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    const tasks = servers.map(async (server) => {
        ns.print(`Attempting to gain access to ${server}`);

        if (!ns.serverExists(server)) {
            ns.print(`ERROR: Server ${server} does not exist!`);
            return;  // Use return to skip this iteration
        }

        // Check if the server already has root access
        if (ns.hasRootAccess(server)) {
            ns.print(`Already have root access to ${server}`);
            return;  // Use return to skip this iteration
        }

        // Run hacking programs sequentially if they exist
        for (const program of programs) {
            if (ns.fileExists(program.name, 'home')) {
                ns.print(`Running ${program.name} on ${server}`);
                await program.fn(server);  // Await each function call
            }
        }

        // Run NUKE.exe if possible
        if (ns.getServerNumPortsRequired(server) <= ns.getServer(server).openPortCount) {
            ns.print(`Running NUKE.exe on ${server}`);
            ns.singularity.nuke(server);
        }

        // Check if we have root access after running the programs
        if (ns.hasRootAccess(server)) {
            ns.print(`Root access gained on ${server}`);
            ns.print(`Installing backdoor on ${server}`);
            await ns.singularity.installBackdoor(server);
        } else {
            ns.print(`Failed to gain root access on ${server}`);
        }
    });

    // Execute all tasks in parallel
    await Promise.all(tasks);

    ns.print("Automation complete.");
}
*/
