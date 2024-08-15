/** @param {NS} ns */
export async function main(ns) {

    async function copyfiles(server) {
        ns.scp('all-list.txt', server, 'home');
        ns.scp('stock-list.txt', server, 'home');
        ns.scp('myOwnServers.txt', server, 'home');
        ns.scp('clientFarm.js', server, 'home');
        ns.scp('masterHack.js', server, 'home');
    }
    async function lowball(server){
        ns.scp('all-list.txt', server, 'home');
        ns.scp('stock-list.txt', server, 'home');
        ns.scp('lowballHack.js', server, 'home');
    }

    //let data = ns.read('distribution-list.txt');
    let data = ns.read('all-list.txt');
    let servers = data.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of servers) {

        if (!ns.hasRootAccess(server)) {
                ns.print(`No root access to ${server}, skipping...`);
                continue; // Skip this server if no root access
            }
        if (ns.getServerMaxRam(server)<=4) {
            await lowball(server);
        }
        else if(ns.getServerMaxRam(server)>4){
          //ns.scp('combined-list.txt', server, 'home');
          await copyfiles(server);
        }
        else if (ns.getServerMaxRam(server)<=0){
          ns.print(`${server} has no RAM, skipping...`);
          continue; // Skip this server if no root access
        }
    }


    let data2 = ns.read('myOwnServers.txt');
    let myServers = data2.split('\n').map(s => s.trim()).filter(s => s !== '');

    for (let server of myServers) {
        if (ns.getServerMaxRam(server) <= 4) {
            await lowball(server);
        } else {
            await copyfiles(server);
        }
    }
}
