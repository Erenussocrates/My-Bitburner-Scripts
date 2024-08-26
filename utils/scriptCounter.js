/** @param {NS} ns */
export async function main(ns) {
    // Get a list of all running scripts on the current server
    const scripts = ns.ps("home");

    // Create a map to store counts of each script with its arguments
    const scriptCounts = new Map();

    // Iterate over each running script
    for (const script of scripts) {
        const scriptName = script.filename;
        const scriptArgs = script.args.join(" "); // Join arguments into a single string

        // Create a unique key for the script based on its name and arguments
        const key = `${scriptName} [${scriptArgs}]`;

        // Increment the count for this script and argument combination
        if (scriptCounts.has(key)) {
            scriptCounts.set(key, scriptCounts.get(key) + 1);
        } else {
            scriptCounts.set(key, 1);
        }
    }

    // Convert the map to an array of key-value pairs, then sort it alphabetically by key
    const sortedScriptCounts = Array.from(scriptCounts.entries()).sort();

    // Print out the results
    ns.tprint("Running scripts on 'home':");
    for (const [key, count] of sortedScriptCounts) {
        ns.tprint(`${key} - ${count} instance(s) running`);
    }
}
