/** @param {NS} ns */
export async function main(ns) {
    const allListFile = "all-list.txt";      // The file with initial list of servers
    const detectedListFile = "detected-list.txt";  // The file to store newly detected servers
    const scanRange = 5;  // Max range for scan-analyze

    // Utility to read file and return an array of lines, properly trimmed of whitespace
    async function readList(fileName) {
        try {
            const fileContent = await ns.read(fileName);
            return fileContent ? fileContent.split("\n").map(line => line.trim()).filter(s => s) : [];
        } catch (err) {
            ns.tprint(`Error reading file ${fileName}: ${err}`);
            return [];
        }
    }

    // Utility to write new entries to detected-list.txt
    async function appendToDetectedList(content) {
        await ns.write(detectedListFile, content + "\n", "a");
    }

    // Utility to extract the server name from detected-list.txt lines
    function extractServerNameFromDetected(line) {
        const match = line.match(/SW Name:\s*([^,]*)/);
        return match ? match[1].trim() : null;
    }

    // Recursive function to scan server neighbors up to a specific depth
    async function deepScan(server, depth) {
        if (depth === 0) return [];

        const neighbors = ns.scan(server);
        let allServers = [...neighbors]; // Collect all neighbors at this level

        // Recurse into each neighbor to scan its neighbors, reducing depth
        for (const neighbor of neighbors) {
            if (neighbor !== 'home') { // Skip 'home'
                allServers = allServers.concat(await deepScan(neighbor, depth - 1));
            }
            await ns.sleep(1);
        }
        return allServers;
    }

    // Fetch list of all currently known servers from both all-list and detected-list
    let allList = await readList(allListFile);
    let detectedList = await readList(detectedListFile).then(lines => lines.map(extractServerNameFromDetected).filter(Boolean));

    // Set to keep track of already scanned servers, excluding "home"
    let scannedServers = new Set([...allList, ...detectedList, 'home']); // Add 'home' to the excluded set

    ns.tprint("Starting the omniscient scan...");

    // Function to scan a server and look for new ones
    async function scanServer(server) {
        if (server === 'home') return; // Skip 'home' server
        ns.print(`Analyzing server: ${server}`);
        // Get deeper scan results using scanRange
        const scanResults = await deepScan(server, scanRange);

        // Analyze each detected server
        for (const detectedServer of scanResults) {
            // Skip if the server has already been scanned or is 'home'
            if (scannedServers.has(detectedServer) || detectedServer === 'home') continue;

            // Record server details
            const reqHack = ns.getServerRequiredHackingLevel(detectedServer);
            const openPorts = ns.getServerNumPortsRequired(detectedServer);
            const serverInfo = `SW Name: ${detectedServer} , Req. Hack: ${reqHack} , Ports: ${openPorts} , Adjacent: ${server}`;

            // Add detected server to detected list and scannedServers
            await appendToDetectedList(serverInfo);
            scannedServers.add(detectedServer);

            ns.print(`New server detected: ${serverInfo}`);
            await ns.sleep(1);
        }
    }

    // Main scanning process loop
    let serversToScan = [...allList]; // Start with the all-list servers

    while (serversToScan.length > 0) {
        const currentServer = serversToScan.shift();
        await scanServer(currentServer);  // Scan current server

        // Refresh the detected list and add newly detected servers to the queue
        const newDetectedList = await readList(detectedListFile).then(lines => lines.map(extractServerNameFromDetected).filter(Boolean));
        for (const serverName of newDetectedList) {
            if (!scannedServers.has(serverName)) {
                serversToScan.push(serverName);
                scannedServers.add(serverName);
            }
            await ns.sleep(1);
        }
        await ns.sleep(1);
    }

    ns.tprint("The omniscient scan is complete. Check the 'detected-list.txt' file.");
}
