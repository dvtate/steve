#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime

echo ""

# move old version of steve to another directory
printf "backing up old version of steve..."

# we should already be in the old bot's directory
mv ../$(basename $(pwd)) ../steve_old
printf " done\n"

# clone the newest version of steve from github
echo "cloning the newest version of steve..."
cd "../"
git clone "https://github.com/robobibb/robobibb-steve-bot"



# get bot token from the old steve.sh
printf "retrieving token from old steve... "
# Explanation: from the file steve.sh; on the line which has "export TELEGRAM_TOKEN=";
#   set token = to the text on the right side of the "="
export TELEGRAM_TOKEN=$(cat "steve_old/steve.sh" | grep "export TELEGRAM_TOKEN=" | awk -F"=" '{print $2}')
printf "done\n"

# setup new Steve
cd robobibb-steve-bot
chmod +x setup.sh steve.sh update.sh
./setup.sh

# Kill current steve
printf "killing current instance of Steve..."

# NOTE: these could make unintended victims...
pkill -f "steve.sh"
pkill -f "node index.js"
printf " done\n"

# make a new steve as fast as possible to minimize downtime
echo "reviving Steve..."
./steve.sh
