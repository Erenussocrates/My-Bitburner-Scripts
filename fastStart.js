/** @param {NS} ns */
export async function main(ns) {

ns.scriptKill('payday.js', "home");
ns.scriptKill('distFarm.js', "home");
ns.scriptKill('macroFarmStart.js', "home");
ns.scriptKill('masterFarm.js', "home");

ns.exec('payday.js', "home")
ns.exec('distFarm.js', "home")
ns.exec('macroFarmStart.js', "home")
ns.exec('masterFarm.js', "home")

}
