/** @param {NS} ns */
export async function main(ns) {
    // Read the list of servers from all-list.txt

    async function jumpstart(server) {
        const controllerScript = 'client/clientController.js';
        const masterFarmScript = 'client/clientFarm.js';
        const lowballScript = 'client/lowballHack.js';

        if(ns.fileExists(controllerScript, server)){
          ns.scriptKill(controllerScript, server);
          ns.exec(controllerScript, server);
        } else {
          ns.print(`${controllerScript} not found on ${server}`);
        }
        if (ns.fileExists(masterFarmScript, server)) {
          ns.scriptKill(masterFarmScript, server);
          ns.exec(masterFarmScript, server);
        } else {
          ns.print(`${masterFarmScript} not found on ${server}`);
        }
        if(ns.getServerMaxRam(server) <= 4){
          if (ns.fileExists(lowballScript, server)){
            ns.scriptKill(lowballScript, server);
            ns.scriptKill(lowballScript, server);
            ns.exec(lowballScript, server);
            ns.exec(lowballScript, server);
          }
          else {
            ns.print(`${lowballScript} not found on ${server}`);
          }
        }
        else if(ns.getServerMaxRam(server) <= 8){
          if (ns.fileExists(lowballScript, server)){
            ns.scriptKill(lowballScript, server);
            ns.scriptKill(lowballScript, server);
            ns.scriptKill(lowballScript, server);
            ns.scriptKill(lowballScript, server);
            ns.exec(lowballScript, server);
            ns.exec(lowballScript, server);
            ns.exec(lowballScript, server);
            ns.exec(lowballScript, server);
          }
          else {
            ns.print(`${lowballScript} not found on ${server}`);
          }
        }
    }

    let data = ns.read('all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {
        if (!ns.hasRootAccess(server)) {
            ns.print(`No root access to ${server}, skipping...`);
            continue; // Skip this server if no root access
        }
        if(ns.getServerMaxRam(server) === 0){
            ns.print(`${server} has no RAM, skipping...`);
            continue; // Skip this server if no root access
        }

        await jumpstart(server);
    }

    let data2 = ns.read('myOwnServers.txt');
    let myServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of myServers) {
        await jumpstart(server);
    }
}
