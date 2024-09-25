/** @param {NS} ns **/
export async function main(ns) {
    const player = ns.getPlayer();
    const intelligence = player.intelligence;

    ns.tprint("Current Karma: " + ns.heart.break());
    ns.tprint(`Current intelligence stat: ${intelligence}`);
}
