all-list.txt , myOwnServers.txt , stock-list.txt:

"all-list.txt" : This will have the names of all servers, regardless of the 
fact if they have money or RAM in them or not. Except it won't have the names of 
my own bought servers. This was made so, that because some processes can be used 
on all servers regardless of the fact if they don't have money or RAM.

"myOwnServers.txt" : Typically, there are names of servers that I have
bought on my own on this list. These servers are used for their ability to
process and run scripts using their RAM. It should be noted however, that
all bought servers are deleted upon augmentation installation.
So, this list needs to be manually reset after each start of the run.

"stock-list.txt" : This will have the names of all servers that have an entry in
the stock market. Growth and hack affect the stock market prices of the servers,
so it's better to keep them in a separate list for stock market price manipulation.
You can first empty the banks of these servers and buy their shares, then grow them
back to the max, and sell the shares, then siphon their bank again.

======================================================================================

macroAnalyze.js and visualPercent.js : 

"macroAnalyze.js" takes a list of server names from the "all-list.txt", and sequentially
prints every listed server's name, whether I have root access or not, current money, 
max money, current security level, min security level, RAM usage, current money 
percentage and growth rate block by block on the terminal.

"visualPercent.js" similarly takes a list of server names from the "all-list.txt", but
only displays a visual representation of the money percentage of the servers line by line.
The lack of other information means I see more money related information per screen space.
It also tells whether I have root access to the server or not.
If "stock" or "stocks" arguments are used together with the script call
(as in, "run visualPercent.js stock" or "run visualPercent.js stocks"), "stock-list.txt"
is used for the list of servers instead of "all-list.txt".

======================================================================================

masterFarm.js , clientFarm.js , masterGrow.js , masterWeaken.js and masterHack.js :

"masterFarm.js" is a script that takes a list of server names from the 
"all-list.txt", and sequentially runs a series of weaken-grow on them,
uses the "masterGrow.js" and "masterWeaken.js" files in order to concurrently
execute multiple processes at once on multiple targets. It also calculates
the remaining RAM on the the home server, and adjusts each operation's threads 
accordingly. It also calculates how many threads it would take to minimize security 
or maximize money, so it doesn't overshoot and waste needless RAM power.
This tremendously speeds up the process of servers, and uses RAM efficiently. 
The servers that can't have any money and the servers that have stock market entries
are spared from the operations. This script is meant to run only at home. The
reason for that is, because "home" has more cores and that supports the grow and weaken
effectiveness, and home also has a great RAM to be able to support all servers. 
So the hacking operation is left only for the other servers. Leaves 100 GB free RAM
at the very least, so that other operations could be run. If the "stock" argument is
used, it uses the scripts on the stock servers instead.

"clientFarm.js" is a script that takes a list of server names from the "all-list.txt",
and sequentially runs "masterHack.js" on them. It also makes a calculation based on
the number of servers with a RAM on "all-list.txt" and "myOwnServers.txt", and
adjusts the threads of "masterHack.js" accordingly. This makes it so that the targets
aren't completely drained by overhacking, and also manages efficient use of the host
RAM.
The servers that can't have any money and the servers that have stock market entries
are spared from the operations. This script is meant to only run at servers other 
than home.

"masterFarm.js" and "clientFarm.js" run on an infinite loop, each instance of 
"masterGrow.js", "masterWeaken.js" and "masterHack.js" run only once.

=======================================================================================

distFarm.js : 

This script takes a list of server names from "all-list.txt" and 
"myOwnServers.txt", then sequentially copies the "all-list.txt", "stock-list.txt", 
"myOwnServers.txt", "clientFarm.js" and "masterHack.js" files to every one of them 
from my home. If a server has 4 GB or less RAM, they get "all-list.txt", 
"stock-list.txt" and "lowballHack.js" instead. 
The RAMless servers are spared from the operation. Runs only once.

=======================================================================================

macroFarmStart.js :

This script takes a list of server names from "all-list.txt" and "myOwnServers.txt",
and sequentially starts the "clientFarm.js" in every one of them if the corresponding 
file exists in the given server, while killing the previous script if it was already 
running. If a server has "lowballHack.js", runs two instances of that. 
Runs only once.

=======================================================================================

lowballHack.js :

A very lightweight code that is designed to work on servers with 4 GB RAM or less.
Takes a list of server names from "all-list.txt", and runs a single hack() operation 
inside the same file, doesn't need an external script. The servers that can't have 
any money and the servers that have stock market entries are spared from the operations.
Runs on an infinite loop.

=======================================================================================

hackBurst.js , growBurst.js and weakenBurst.js :

"hackBurst.js" takes a list of servers from "all-list.txt", and executes the 
"masterHack.js" once on each server with a predetermined, increased number of 
threads, once. The same goes for "weakenBurst.js" and "growBurst.js" as well.
The servers that can't have any money and the servers that have stock market 
entries are spared from the operations. If you use the "stock" argument while
running the scripts, they will only execute their scripts on the stock servers.
They run only once.

=======================================================================================

fastStart.js :

This can be used for automatically restarting the "distFarm.js", "macroFarmStart.js" 
and "masterFarm.js" scripts at home when I kill all the running scripts for any 
reason. Also checks and terminates if the same scripts were already running before. 
Runs only once.

=======================================================================================

hacknet-manager.js : 

This script takes a threshold of my current money to be spent on hacknet upgrades, 
and automatically updates my hacknet network with the most efficient upgrade choice 
based on the ratio of upgrade cost to income increase. Also purchases new hacknet 
nodes when available. Runs on an infinite loop.

=======================================================================================

stockSiphon.js , stockNurture.js , stockHack.js , stockGrow.js , stockWeaken.js :

Both scripts take a list of server names from the "stock-list.txt", and 
puts them inside an array of data structures that hold these servers' attributes.

"stockNurture.js" does grow and weaken operations on these servers until their money
are maximized and security are minimized.

"stockSiphon.js" does hack and weaken operations on these servers until their server 
money are minimized and security are minimized.

Both run on a limited loop.

They need "stockHack.js", "stockGrow.js" and "stockWeaken.js" files that are
separate from the usual "masterHack.js", "masterGrow.js" and "masterWeaken.js",
because their own operation scripts have the "stock : true" argument enabled,
which affects their stock market prices.

======================================================================================

stockAnalyze.js , stockPrint.js and stock-record.txt :

(These scripts can only work after you buy all the access API from the stock exchange)

"stockAnalyze.js" creates a data structure for each entry in the stock market.
This structure has variables for the stock symbol, stock prices, lowest price,
highest price, median price, bid price, ask price and forecast for each entry. 
And at 6 second intervals, the script pulls the current stock values of each entry, 
while re-evaluting the lowest price, highest price and median price on each loop. 
This way, the script saves a series of prices for each of the stock entry.
Runs until stopped.

"stockPrint.js" takes all the data structure objects and the accumulated list of
prices inside, and prints them inside the "stock-record.txt" neatly, block by block,
in descending order of median price. Also prints for how long the "stockAnalyze.js"
script has been running at the end, and terminates the "stockAnalyze.js" script.
Runs only once. "stock-record.txt" is a file that is for the user's eyes only.

=======================================================================================

stockBuy.js , stockSell.js , manualStockTransaction.js and stockReceipt.txt :

(These scripts can only work after you buy all the access API from the stock exchange)

Also, it should be taken into account that the "stockAnalyze.js" must have been running for 
some time, and must be kept running for the duration of these scripts for a healthy outcome.

"stockBuy.js" accepts a stock symbol as the parameter. If the specified stock's server
money is at 0%, and if the specified stock's buying price is less than or equal to a 
threshold that is close to the stock's recorded lowest price value, and if the forecast
is within a certain value, the script buys as many shares as possible of the specified
stock using the 25% of the "home"s current money. Then it prints the stock symbol,
amount of shares bought, the money paid, and the date and hour to the "stockReceipt.txt"
file. Then starts the "stockSell.js" file and terminates itself.

"stockSell.js" accepts the same stock symbol that it's parent "stockBuy.js" process
has gotten. If the specified stock's server money is at 100%, and if the specified stock's
selling price is more than or equal to a threshold that is close to the stock's recorded
highest price value, and if the forecast is within a certain value, the script sells all the
shares that belonged to the symbol. It also sells all the shares if the selling price of
the shares fall within a certain threshold of the price that the shares were bought for.
Then, it prints the stock symbol, the money gotten, and the date and the hour to the
"stockReceipt.txt" file. Then terminates itself. 

"manualStockTransaction.js" takes 3 arguments while it's about to be run by the user:
first the stock symbol, second the buying price, lastly the selling price. If the 
dynamic buying and selling of the shares at the lowest and highest points don't work as
intended in above scripts, the user can always analyze a stock for some time using the
"stockAnalyze.js", find out the lowest and highest points, and then manually enter those
points as the arguments for this script. Even if the stock control of hacking and
growing doesn't work, as long as this script is running, a time could come when
this script will certainly bear fruit. And you can run as many of them for as many
different symbols as you want in parallel. Runs on a limited loop.

It should be noted that both "stockBuy.js", "stockSell.js" and "manualStockTransaction.js" 
won't erase the previous contents of the receipt file, and that it's possible to run these 
scripts simultaneously for different servers. And it should be noted that, whenever there 
is a new entry in the "stock-list.txt", that entry should also be added into the internal 
list of "stockBuy.js" and "stockSell.js" together with it's stock symbol.

=======================================================================================

singularityStart.js :

This script takes a list of server names from the "all-list.txt",
and sequentially cracks all the closed ports (if you have the respective programs), 
then runs NUKE.exe, and if that succeeds, installs a backdoor. This script is solely
made for making the game start easier and faster by automating it after some
augmentations are installed and the old progress was reset. Runs only once.

There are also two separate blocks inside the file, one of them goes through
the list sequentially, while the other one attempts to hack the servers concurrently.

But this script can only work with access to the Singularity API, which is available
only after the BITNODE-4 is successfully finished. 
