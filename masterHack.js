/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0]; // Get the server name from the arguments
    await ns.hack(target);
}
