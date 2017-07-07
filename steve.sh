#!/bin/sh

## this script is used to run the bot
## in addition it helps to maintain privacy of our bot token

# telegram bot token (this will be edited by setup.sh)
export TELEGRAM_TOKEN=your token


# gets run after Steve is killed
function cleanup {
	printf "Killing Steve... "
	kill -KILL $STEVE_PID
	printf "done\n"
}

# run cleanup before exiting
trap cleanup EXIT

# gets run before Steve is started
printf "Spawning Steve... "

# start steve & mark his PID
node index.js & 
STEVE_PID=$!

printf "done\n"

# wait for eternity... unless they kill me...
cat

# this should never get run
echo "Steve -> error -> cat abuse..."
