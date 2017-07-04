#!/bin/sh

## this script is used to run the bot
## in addition it helps to maintain privacy of our bot token

# telegram bot token (this will be edited by setup.sh)
export TELEGRAM_TOKEN=[your telegram bot token]


# gets run after Steve is killed
function cleanup {
	printf "\nSteve - Goodbye\n"
}

# run cleanup before exiting
trap cleanup EXIT

# gets run before Steve is started
echo "Steve - Hello"

# start steve
node index.js

# this should never get run
echo "error in  steve.sh -1"
