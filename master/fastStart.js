/** @param {NS} ns */
export async function main(ns) {

ns.scriptKill('master/ipvgo.js', "home");
ns.scriptKill('master/RAMcontroller.js', "home");
ns.scriptKill('master/distFarm.js', "home");
ns.scriptKill('master/macroFarmStart.js', "home");
ns.scriptKill('master/masterFarm.js', "home");

ns.exec("utils/intro.js", "home");
ns.exec('master/RAMcontroller.js', "home");
ns.exec('master/distFarm.js', "home");
ns.exec('master/macroFarmStart.js', "home");
ns.exec('master/masterFarm.js', "home");

}
