/** @param {NS} ns */
export async function main(ns) {
    // List of stock symbols to process
    const stockSymbols = [
        "ECP", "MGCP", "BLD", "CLRK", "OMTK", "FSIG", "KGI", "FLCM", "STM", "DCOMM", "HLS",
        "VITA", "ICRS", "UNV", "AERO", "OMN", "SLRS", "GPH", "NVMD", "WDS", "LXO", "RHOC",
        "APHE", "SYSC", "CTK", "NTLK", "OMGA", "FNS", "SGC", "JGN", "CTYS", "MDYN", "TITN"
    ];

    // Loop through each stock symbol and call stock/stockBuy.js
    for (let stockSymbol of stockSymbols) {
        ns.run("stock/stockBuy.js", 1, stockSymbol);
        await ns.sleep(10); // Small delay between calls to avoid overwhelming the system
    }

    ns.tprint("All stock buy processes have been initiated.");
}
