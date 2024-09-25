/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        const delay = 100; // Time in milliseconds to wait before refreshing the screen
        ns.ui.clearTerminal(); // Clear the terminal before printing new text
        ns.exec("utils/visualPercent.js", "home", 1, "compressed"); // Pass the "compressed" argument
        await ns.sleep(delay);
    }
}
