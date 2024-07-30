combined-list.txt , distribution-list.txt , myOwnServers.txt , all-list.txt ,
stock-list.txt , stock-record.txt :

"combined-list.txt" : Typically, there are names of servers that have
money inside them on this list, so that they can be used for various 
grow-weaken-hack processes. For this reason, moneyless servers won't be
on this list. Also, the servers who have entries in Stock Market won't be
on this list either.

"distribution-list.txt" : Typically, there are names of servers that have
RAM inside them on this list, so that they can be used for their ability to
process and run scripts. For this reason, RAMless servers won't be on this
list.

"myOwnServers.txt" : Typically, there are names of servers that I have
bought on my own on this list. These servers are used for their ability to
process and run scripts using their RAM. It should be noted however, that
all bought servers are deleted upon augmentation installation.
So, this list needs to be manually reset after each start of the run.

"all-list.txt" : This will have the names of all servers, regardless of the 
fact if they have money or RAM in them or not. Except it won't have the names of 
my own bought servers. This was made so, that because some processes can be used 
on all servers regardless of the fact if they don't have money or RAM.

"stock-list.txt" : This will have the names of all servers that have an entry in
the stock market. Growth and hack affect the stock market prices of the servers,
so it's better to keep them in a separate list for stock market price manipulation.
You can first empty the banks of these servers and buy their shares, then grow them
back to the max, and sell the shares, then siphon their bank again.

"stock-record.txt" : This will have the records of various attributes of the
stock market entries based on date and available money.

======================================================================================

macroAnalyze.js : 

This script takes a list of server names from the "all-list.txt", and sequentially
prints every listed server's name, whether I have root access or not, current money, 
max money, current security level, min security level, RAM usage and 
current money percentage block by block on the terminal. Runs only once.

======================================================================================

masterFarm.js , masterGrow.js and masterWeaken.js :

"masterFarm.js" is a script that takes a list of server names from the 
"combined-list.txt", and sequentially runs a series of grow-weaken on them,
and uses the "masterGrow.js" and "masterWeaken.js" files in order to concurrently
execute multiple processes at once on multiple targets. This tremendously speeds up the
weakening and the growing process of servers, but also takes up the entirety of 
the RAM usage. "masterFarm.js" runs on an infinite loop, each instance of "masterGrow.js"
and "masterWeaken.js" are spawned by the "masterFarm.js", and they run only once.

The "weakenThreads" and "growThreads" variables inside the "masterFarm.js" could
be given a greater number in the event that Home RAM becomes so big that the
processes cannot entirely fill it up until the first ones finish.

=======================================================================================

distFarm.js : 

This script takes a list of server names from "distribution-list.txt" and 
"myOwnServers.txt", then sequentially copies the "combined-list.txt", 
"masterFarm.js", "masterGrow.js" and "masterWeaken.js" files to every one
of them from my home, and if the target server has only 8 GB of RAM or less,
it copies the "combined-list.txt" and "payday.js" instead. Runs only once.

=======================================================================================

macroFarmStart.js :

This script takes a list of server names from "all-list.txt" and "myOwnServers.txt",
and sequentially starts the "masterFarm.js" or "payday.js" in every one of them 
if the corresponding file exists in the given server, while killing the previous 
script if it was already running. If it's going to run "payday.js", it calculates the
maximum number of threads "payday.js" can run on that server, and runs it with the 
specified number of threads for that server. Runs only once.

=======================================================================================

payday.js : 

This script takes a list of server names from "combined-list.txt", and hacks each
one of them if their current money is above a certain percentage of the max money.
Runs on an infinite loop.

=======================================================================================

fastStart.js :

This can be used for automatically restarting the "payday.js", "distFarm.js", 
"macroFarmStart.js" and "masterFarm.js" scripts at home when I kill all the running 
scripts for any reason. Also checks and terminates if the same scripts were already 
running before. Runs only once.

=======================================================================================

stockSiphon.js , stockNurture.js , biggerSiphon.js , biggerNurture.js:

Both scripts take a list of server names from the "stock-list.txt", and 
puts them inside an array of data structures that hold these servers' attributes.

"stockNurture.js" does grow and weaken operations on these servers until their money
are maximized and security are minimized.

"stockSiphon.js" does hack and weaken operations on these servers until their server 
money are minimized and security are minimized.

Both run on a limited loop.

"biggerSiphon.js" and "biggerNurture.js" calls their corresponding scripts with more 
numbers of threads. These run once.

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
