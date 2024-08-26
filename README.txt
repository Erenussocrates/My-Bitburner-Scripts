-------TABLE OF CONTENTS-------

1) THE TEXT FILES
  README.txt,
  all-list.txt,
  myOwnServers.txt,
  stock-list.txt,
  stock-record.txt,
  stockReceipt.txt,
  How-To-Do-Terminal-Input-Example.txt,
2) master/
  RAMcontroller.js,
  distFarm.js,
  macroFarmStart.js,
  masterFarm.js,
  masterGrow.js and masterWeaken.js,
  fastStart.js,
  hackBurst.js, growBurst.js and weakenBurst.js,
  hacknet-manager.js,
  ipvgo.js,
  stockSiphon-signal.js,
  singularityStart.js,
3) client/
  clientController.js,
  clientFarm.js,
  masterHack.js,
  lowballHack.js,
  stockSiphon.js,
  stockHack.js,
4) stock/
  stockAnalyze.js,
  stockPrint.js,
  stockBuy.js,
  stockSell.js,
  manualStockTransaction.js,
  stockNurture.js,
  stockGrow.js,
5) utils/
  macroAnalyze.js,
  visualPercent.js,
  animatedPercent.js,
  scriptCounter.js,
  myKarma.js,
  intro.js,
  unachievable.js,
6) games/
  hangman.js,
  rockPaperScissors.js,
7) coding-contracts/

======================================================================================

1) THE TEXT FILES 

-The text files typically exist within the main root and they are not kept within
a folder.

CONTENTS = 
all-list.txt , myOwnServers.txt , stock-list.txt, stock-record.txt , 
stockReceipt.txt , How-To-Do-Terminal-Input-Example.txt

* "README.txt" : 
This current document that you are reading right now. It holds all
the information about my system's current files and scripts.

* "all-list.txt" : 
This will have the names of all servers, regardless of the 
fact if they have money or RAM in them or not. Except it won't have the names of 
my own bought servers. This was made so, that because some processes can be used 
on all servers regardless of the fact if they don't have money or RAM.

* "myOwnServers.txt" : 
Typically, there are names of servers that I have
bought on my own on this list. These servers are used for their ability to
process and run scripts using their RAM. It should be noted however, that
all bought servers are deleted upon augmentation installation.
So, this list needs to be manually reset after each start of the run.

* "stock-list.txt" : 
This will have the names of all servers that have an entry in
the stock market. Growth and hack affect the stock market prices of the servers,
so it's better to keep them in a separate list for stock market price manipulation.
You can first empty the banks of these servers and buy their shares, then grow them
back to the max, and sell the shares, then siphon their bank again.

* "stock-record.txt" : 
The information recorded by "stock/stockAnalyze.js" is 
passed to "stock/stockPrint.js" when "stock/stockPrint.js" is run, and 
"stock/stockPrint.js" prints all the information recorded by 
"stock/stockAnalyze.js" onto this text file.
"stock-record.txt" is typically a file that is for the user's own interpretation only.

* "stockReceipt.txt" : 
When the scripts "stock/stockBuy.js", "stock/stockSell.js" or
"stock/manualStockTransaction.js" reaches a certain stage in their execution, they
buy or sell shares of a certain stock, and that information is then written on the
"stockReceipt.txt" for the user's inspection.
It should be noted that both "stock/stockBuy.js", "stock/stockSell.js" and 
"stock/manualStockTransaction.js" won't erase the previous contents of the receipt file, 
and that it's possible to run these scripts simultaneously for different servers.

* "How-To-Do-Terminal-Input-Example.txt" : 
It keeps an example script of how to create a script that takes runtime user inputs
from the terminal while executing the script. It also provides explanations. 
The scripts within "/games" make heavy use of that method to work. 
This code snippet is courtesy of "X5934 078FR1" on steam forums.

======================================================================================

2) master/

-These scripts are typically only meant to be run at "home".

CONTENTS =
RAMcontroller.js , distFarm.js , fastStart.js , growBurst.js , 
hackBurst.js , hacknet-manager.js , ipvgo.js , macroFarmStart.js ,
masterFarm.js , masterGrow.js , masterWeaken.js , singularityStart, js ,
stockSiphon-signal.js , weakenBurst.js 

* "RAMcontroller.js" :
Takes the count of servers that we have root access, and that can have money from 
"all-list.txt", and takes the count of servers that we have root access from "stock-list.txt", 
partitions home's current RAM based on the number of servers from each list, and allocates 
those RAM to "masterFarm.js" and "stock/stockNurture.js". Leaving at least 1% of home's 
max RAM free, to potentially be used by any new script. If only one of the scripts out 
of "masterFarm.js" or "stock/stockNurture.js" are running, then allocates the entire 
available RAM for that script.
Also always keeps an instance of "ipvgo.js" script running at home.
Runs on an infinite loop.

* "distFarm.js" :
It takes a list of server names from "all-list.txt" and "myOwnServers.txt", then 
sequentially copies the "all-list.txt", "stock-list.txt", "myOwnServers.txt", 
"client/clientController.js", "client/clientFarm.js", "client/masterHack.js",
"client/stockSiphon.js" and "client/stockHack.js" files to every one of them from my home. 
If a server has 8 GB or less RAM, they get "all-list.txt", "stock-list.txt" and 
"client/lowballHack.js" instead. 
The RAMless servers are spared from the operation. 
Runs only once.

* "macroFarmStart.js" :
It takes a list of server names from "all-list.txt" and "myOwnServers.txt",
and sequentially starts the "client/clientController.js " and "client/clientFarm.js" 
in every one of them if the files exist in the given server, while killing the previous 
scripts if they were already running. 
If a server has 8 GB or less RAM, runs 4 instances of "client/lowballHack.js" instead.
If a server has 4 GB or less RAM, runs 2 instances of "client/lowballHack.js" instead.
Basically it starts the scripts that were sent by the "distFarm.js".
Runs only once.

* "masterFarm.js" :
This is a script that takes a list of server names from the "all-list.txt", and 
sequentially runs a series of weaken-grow on them, uses the "masterGrow.js" and 
"masterWeaken.js" files in order to concurrently execute multiple processes at once 
on multiple targets. It also draws the remaining RAM from "RAMcontroller.js" and 
adjusts each operation's threads accordingly. It also calculates how many threads 
it would take to minimize security or maximize money, so it doesn't overshoot 
and waste needless RAM power.
This tremendously speeds up the processing of servers, and uses RAM efficiently. 
The servers that can't have any money, and the servers that have stock market entries
are spared from the operations. 
If the "stock" argument is used, it uses the scripts on the stock servers instead.
The reason for why the "masterFarm.js", "masterGrow.js" and "masterWeaken.js"
are typically only meant to be run at home is, because "home" has more cores than other 
servers, and that enhances the effectiveness of grow and weaken operations, and home 
also has a great amount of RAM to be able to support the spawn of numerous "masterGrow.js" 
and "masterWeaken.js" scripts on all servers. That's why the hacking operation is 
typically left only for the other servers to be run.
Runs on an infinite loop. 

* "masterGrow.js" and "masterWeaken.js" :
These scripts are spawned by the "masterFarm.js", and they take server names and
number of threads as arguments from "masterFarm.js". 
Each instance runs only once.

* "fastStart.js" :
This can be used for automatically restarting the "RAMcontroller.js", "distFarm.js", 
"macroFarmStart.js" and "masterFarm.js" scripts at home when I kill all the running 
scripts for any reason. Also checks and terminates if the same scripts were already 
running before. 
Runs only once.

* "hackBurst.js" , "growBurst.js" and "weakenBurst.js" :
"hackBurst.js" takes a list of server names from "all-list.txt", and executes 
the "client/masterHack.js" once on each server with a predetermined number of 
threads, once. The same goes for "weakenBurst.js" and "growBurst.js", for their
respective scripts.
The servers that can't have any money and the servers that have stock market 
entries are spared from the operations. 
If you use the "stock" argument while running the scripts, they will only execute 
their scripts on the stock servers.
They run only once.

* "hacknet-manager.js" : 
This script takes a threshold of my current money to be spent on hacknet upgrades, 
and automatically updates my hacknet network with the most efficient upgrade choice 
based on the ratio of upgrade cost to income increase. Can purchase new hacknet 
nodes by itself. 
Runs on an infinite loop.

* "ipvgo.js" :
This script contains an algorithm that automates the IPvGO minigame. It's general
strategy involves in dividing the board into quarters, applying divide and conquer
tactics on the opponents, and leveraging the opponent's misplays. 
It automatically restarts a game against either Netburners or Slum Snakes when the 
game ends. 
"RAMcontroller.js" makes sure that always one instance of this script is always running 
in the background. 
Runs on an infinite loop.

* "stockSiphon-signal.js" :
This script takes a list of names from the "all-list.txt", and sends a signal for
every server that we have a root access to start their "client/stockSiphon.js"
scripts. To be used when we decide that it's time to lower the stock prices.
Runs only once.

* "singularityStart.js" :
(This script can only work after you obtain the Singularity API, which is available
only after the BITNODE-4 is successfully finished)
This script takes a list of server names from the "all-list.txt", and sequentially 
cracks all the closed ports (if you have the respective programs), then runs NUKE.exe, 
and if that succeeds, installs a backdoor. This script is solely made for making the 
game start easier and faster by automating it after some augmentations are installed 
and the old progress was reset.
There are also two separate blocks inside the file, one of them goes through
the list sequentially, while the other one attempts to hack the servers concurrently.
Runs only once.

======================================================================================

3) client/

- These scripts are typically meant to be sent to other servers to be run
by them, as they are mostly about the hack operation. But "stockSiphon.js",
"masterHack.js" or "stockHack.js" could be run at "home" for reduced efficiency too.

CONTENTS =
clientController.js , clientFarm.js , lowballHack.js , masterHack.js ,
stockHack.js , stockSiphon.js

* "clientController.js" :
This is a version of the "master/RAMcontroller.js" that is meant to be used by the
other servers only. 
Takes the count of servers that we have root access, and that can have money from 
"all-list.txt", and takes the count of servers that we have root access from "stock-list.txt", 
partitions current RAM of the server that it's running on, based on the number of servers 
from each list, and allocates those RAM to "clientFarm.js" and "stockSiphon.js". 
Leaving at least 5.7 GB of the host server's max RAM free, to potentially be used by one
of the starting scripts. 
If only one of the scripts out of "clientFarm.js" or "stockSiphon.js" are running, 
then allocates the entire available RAM for that script.
Runs on an infinite loop.

* "clientFarm.js" :
This is a version of the "master/masterFarm.js" that is meant to be used by the
other servers only.
Takes a list of server names from the "all-list.txt", and sequentially runs 
"masterHack.js" on them. It receives allocated RAM from "clientController.js" to
be used by the spawned scripts.
It also makes a calculation based on the number of servers with a RAM on "all-list.txt" 
and "myOwnServers.txt", and adjusts the threads of "masterHack.js" accordingly. 
This makes it so that the targets aren't completely drained by overhacking, 
and also manages efficient use of the host RAM. 
The servers that can't have any money and the servers that have stock market entries
are spared from the operations. 
Also ignores "n00dles" server, as it's maximum money is pretty low, and it's prone to 
be overdrained even with single threaded hacks.

* "masterHack.js" :
This script is spawned by the "clientFarm.js", and it takes server names and number of
threads as arguments from "clientFarm.js". 
Each instance runs only once.

* "lowballHack.js" :
A very lightweight code that is designed to work on servers with 8 GB RAM or less.
Takes a list of server names from "all-list.txt", and runs a single hack() operation 
inside the same file, doesn't need an external script. The servers that can't have 
any money and the servers that have stock market entries are spared from the operations.
This script doesn't spare "n00dles" server from the hack.
Runs on an infinite loop.

* "stockSiphon.js" :
This script takes a list of server names from the "stock-list.txt", and puts them inside
an array of data structures that hold these servers' attributes. If it is running, it also
takes a pre-allocated amount of RAM from "clientController.js" to use in it's script based
on the number of available stock servers. "stockSiphon.js" does hack operations on these 
servers by calling instances of "stockHack.js" until their server money are minimized.
It takes a signal from "master/stockSiphon-signal.js" to start.
Runs on a limited loop.

* "stockHack.js" :
This is a version of "masterHack.js" that is to be spawned by "stockSiphon.js" instead.
We need "stockHack.js" and "stockGrow.js" files that are separate from the usual 
"masterHack.js" and "masterGrow.js" files, because their own operation scripts have 
the "stock : true" argument enabled, which affects stock market prices of the affected
servers.
Each instance runs only once.

======================================================================================

4) stock/

- These scripts are typically related to stock market operations, and they are meant
to be run at "home". 
(Most of these scripts can only work after you buy all the API access from the stock exchange)

CONTENTS =
manualStockTransaction.js , stockAnalyze.js , stockBuy.js , stockGrow.js , 
stockNurture.js , stockPrint.js , stockSell.js 

* "stockAnalyze.js" : 
It creates a data structure for each entry in the stock market. This structure has 
variables for the stock symbol, stock prices, lowest price, highest price, median price, 
bid price, ask price and forecast for each entry. And at 6 second intervals, the script 
pulls the current stock values of each entry, while re-evaluting the lowest price, 
highest price and median price on each loop. This way, the script saves a series of data 
for each of the stock entry. 
Optionally, this script can accept 2 arguments when it's about to be run.
For example, "stockAnalyze.js 20 m" runs the script for 20 minutes, and then runs 
"stockPrint.js" when the time is up. 
For example, "stockAnalyze.js 2 h" runs the script for 2 hours, and then runs 
"stockPrint.js" when the time is up.
If no arguments are given, runs until stopped.

* "stockPrint.js" : 
It takes all the data structure objects and the accumulated list of prices from
"stockAnalyze.js", and prints them inside the "stock-record.txt" neatly, block by block,
in descending order of median price. Also prints for how long the "stockAnalyze.js"
script has been running at the end, then terminates the "stockAnalyze.js" script.
Runs only once. 

* "stockBuy.js" : 
(It should be noted that the "stockAnalyze.js" must have been running for some time, 
and must be kept running for the duration of this script for a healthy outcome)
It accepts a stock symbol as the parameter. If the specified stock's server money is at 
or less than 10%, and if the specified stock's buying price is less than or equal to a 
threshold that is close to the stock's recorded lowest price value, and if the forecast is 
within a certain value, the script buys as many shares as possible of the specified
stock using the 25% of the home's current money. 
Then it prints the stock symbol, amount of shares bought, the money paid, 
and the date and hour to the "stockReceipt.txt" file. 
Then starts the "stockSell.js" file and terminates itself.
It should be noted that, if your stock list is yet incomplete, when you add a new
server to the "stock-list.txt", you must add it's stock symbol and server name combination
inside the "stockBuy.js" and "stockSell.js" for your scripts to be able to recognize them.
It should be noted that both "stockBuy.js", "stockSell.js" and "manualStockTransaction.js" 
won't erase the previous contents of the receipt file, and that it's possible to run these 
scripts simultaneously for different servers.
Runs on a limited loop.

* "stockSell.js" :
(It should be noted that the "stockAnalyze.js" must have been running for some time, 
and must be kept running for the duration of this script for a healthy outcome)
It automatically receives the same stock symbol that it's parent "stockBuy.js" script
has gotten. If the specified stock's server money is at 90% of the max server money, 
and if the specified stock's selling price is more than or equal to a threshold that 
is close to the stock's recorded highest price value, and if the forecast is within a 
certain value, the script sells all the shares that belonged to the symbol. 
It can also automatically sell all the shares if the selling price of the shares fall 
within a certain threshold of the price that the shares were bought, for the loss and 
mid mitigations.
Then, it prints the stock symbol, the money gotten, and the date and the hour to the
"stockReceipt.txt" file, and terminates itself. 
It should be noted that, if your stock list is yet incomplete, when you add a new
server to the "stock-list.txt", you must add it's stock symbol and server name combination
inside the "stockBuy.js" and "stockSell.js" for your scripts to be able to recognize them.
It should be noted that both "stockBuy.js", "stockSell.js" and "manualStockTransaction.js" 
won't erase the previous contents of the receipt file, and that it's possible to run these 
scripts simultaneously for different servers.
Runs on a limited loop.

* "manualStockTransaction.js" : 
It takes 3 arguments while it's about to be run by the user:
first the stock symbol, second the buying price, lastly the selling price. If the 
dynamic buying and selling of the shares at the lowest and highest points don't work as
intended in above scripts, the user can always manually analyze a stock for a duration 
using the "stockAnalyze.js", find out the lowest and highest points of a stock, 
and then manually enter those points as the arguments for this script. 
Even if the stock market control of hacking and growing doesn't work, 
as long as this script is running, a time could come when this script will certainly 
bear fruit. And you can run as many of them for as many different symbols as you want in parallel.
It can also automatically sell all the shares if the selling price of the shares fall 
within a certain threshold of the price that the shares were bought, for the loss and 
mid mitigations.
This script won't take "forecast" into account either. 
It should be noted that both "stockBuy.js", "stockSell.js" and "manualStockTransaction.js" 
won't erase the previous contents of the receipt file, and that it's possible to run these 
scripts simultaneously for different servers.
Runs on a limited loop.

* "stockNurture.js" :
It takes a list of server names from the "stock-list.txt", and puts them inside an array 
of data structures that hold these servers' attributes. If it's running, it also take a 
pre-allocated amount of RAM from "RAMcontroller.js" to use in it's script, based on the 
available number of stock servers. "stockNurture.js" does grow operations on these servers 
using instances of "stockGrow.js" until their server money are maximized.
Runs on a limited loop.

* "stockGrow.js" :
This is a version of "master/masterGrow.js" that is to be spawned by "stockNurture.js" instead.
We need "stockHack.js" and "stockGrow.js" files that are separate from the usual 
"masterHack.js" and "masterGrow.js" files, because their own operation scripts have 
the "stock : true" argument enabled, which affects stock market prices of the affected
servers.
Each instance runs only once.

======================================================================================

5) utils/

- These are typically utility-based scripts that makes the life easier for the user,
and they are meant to be used at "home".

CONTENTS =
macroAnalyze.js , visualPercent.js , animatedPercent.js , scriptCounter.js , 
myKarma.js , intro.js , unachievable.js

* "macroAnalyze.js" : 
It takes a list of server names from the "all-list.txt", and sequentially
prints every listed server's name, whether I have root access or not, current money, 
max money, current security level, min security level, RAM usage, current money 
percentage and growth rate block by block on the terminal.
Runs only once.

* "visualPercent.js" : 
Similarly to the "macroAnalyze.js", it takes a list of server names from the "all-list.txt", 
but only displays a visual representation of the money percentage of the servers line by line.
The lack of other information means I see more money related information per screen space.
It also tells whether I have root access to the server or not.
If "stock" or "stocks" arguments are used together with the script call
(as in, "run visualPercent.js stock" or "run visualPercent.js stocks"), "stock-list.txt"
is used for the list of servers instead of "all-list.txt".
Runs only once.

* "animatedPercent.js" :
It is a script that clears the terminal window and calls the "visualPercent.js" script 
on certain intervals over and over again to simulate a continuous visual animation of 
the ongoing server money levels. Take note that you can't use the terminal window for 
anything else while this script is ongoing. 
Runs until it's manually terminated with "kill animatedPercent.js".

* "scriptCounter.js" : 
It displays the number of running processes on terminal for each script and each argument.

* "myKarma.js" : 
It displays the hidden stat that is "karma" on the terminal.

* "intro.js" :
This script is called at the beginning by "master/fastStart.js" and it prints a bunch of
splash screen ASCII art. Has no utility otherwise.

* "unachievable.js" :
This can be used to unlock the only steam achievement that is otherwise impossible to unlock.

======================================================================================

6) games/

- These are scripts that start a minigame on the terminal. They all typically use 
methods provided by "X5934 078FR1" on steam forums. "client/masterHack.js" is called 
with varying threads on a random server, after the user's victorious outcome of the minigames.
You have to type ";" at the end of your input in order to pass the input to the script in both
games.

CONTENTS =
hangman.js , rockPaperScissors.js

* "hangman.js" :
It's a hangman game where the player has 5 attemps. If the player ends up winning, 
they will hack a random server with the number of letters of the guessed word as the threads. 
There are more than a thousand words in the pool.
You have to type a character, and then type ";" in the terminal to make your guess. 
For example, if you want to guess the "e" letter, you have to type "e;" in the terminal,
and as soon as you typed ";", your input will be passed to the script to be evaluated.

* "rockPaperScissors.js" :
It's a rock, paper, scissors game, where the player specifies the goal score at the beginning.
If the player ends up winning, they will hack a random server with the goal score as the
number of threads.
At the start of the game, you will have to input the goal score. If you type "5;", the
first player who gets to 5 points will win. When the game begins, you have to choose
a move. If you want to do scissors, you have to either type "scissors;" or "s;" for
your input to be accepted as scissors. "paper;" or "p;" for paper, "rock;" or "r;" for rock.

======================================================================================

7) coding-contracts/

- The folder is pretty self-explanatory, you can inspect the .js files inside which 
has the contract problems also described in it, together with the codes that solved them.
