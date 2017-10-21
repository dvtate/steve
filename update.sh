#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime

echo "Steve is redefining himself... updating sources from GitHub"

# get bot token from the old steve.sh
printf "retrieving Telegram token from Steve... "

# Explanation: from the file steve.sh; on the line which has "export TELEGRAM_TOKEN=";
#   set token = to the text on the right side of the "="
export TELEGRAM_TOKEN=$(cat "steve.sh" | grep "export TELEGRAM_TOKEN=" | awk -F"=" '{print $2}')
printf "done\n"


# clone the newest version of steve from github
printf "Fetching the newest version of Steve..."
git fetch --all
printf "Hard forcing changes to Steve's source..."
git reset --hard origin/master


# setup new Steve
echo "Re-configuring Steve similar to old one..."
sh "setup.sh"

# kill and revive steve
printf "spawning new steve..."
./steve.sh
