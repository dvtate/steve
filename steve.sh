#!/bin/sh

## this script is used to run the bot
## in addition it helps to maintain privacy of our bot token

# telegram bot token (this will be edited by setup.sh)
export TELEGRAM_TOKEN=406827913:AAFB6_g45axPoH15us0dnAVdTIhkBVd7nZg


# gets run after Steve is killed
function cleanup {
	printf "\nSteve - Goodbye\n"
	kill $STEVE_PID
}

# run cleanup before exiting
trap cleanup EXIT

# gets run before Steve is started
echo "Steve - Hello"

# start steve & mark his PID
node index.js & 
STEVE_PID=$!

# wait for eternity... unless they kill me...
cat

# this should never get run
echo "error in  steve.sh -1"
