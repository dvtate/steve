#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime


# move old version of steve to another directory
printf "backing up old version of steve..."

# we should already be in the old bot's directory
mv ../$(basename $(pwd)) ../steve_old
printf " done\n"

# clone the newest version of steve from github
echo "cloning the newest version of steve..."
cd ".."
git clone https://github.com/robobibb/robobibb-steve-bot

# setup new steve
cd robobibb-steve-bot
chmod +x setup.sh steve.sh update.sh
./setup.sh

# stop any currently running instance of the bot
printf "killing current instance of Steve..."

# these could make unintended victims
pkill -f steve.sh
pkill -f node index.js
printf " done\n"

# restart bot
echo "reviving Steve..."
./steve.sh
