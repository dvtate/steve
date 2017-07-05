#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime

echo "Steve is redefining himself... updating sources from github"
echo "There should be zero noticeable down time..."

# move old version of steve to another directory
printf "\nBacking up old version of Steve... "

curname=$(basename $(pwd))
cd ..
mv "$curname" "steve_old/"

printf "done\n"

# clone the newest version of steve from github
echo "Cloning the newest version of Steve... "
git clone "https://github.com/robobibb/robobibb-steve-bot"

# get bot token from the old steve.sh
printf "retrieving token from the old steve... "
# Explanation: from the file steve.sh; on the line which has "export TELEGRAM_TOKEN=";
#   set token = to the text on the right side of the "="
export TELEGRAM_TOKEN=$(cat "steve_old/steve.sh" | grep "export TELEGRAM_TOKEN=" | awk -F"=" '{print $2}')
printf "done\n"

# setup new Steve
echo "Re-configuring Steve similar to old one...
cd "robobibb-steve-bot"
chmod +x setup.sh steve.sh update.sh
sh "setup.sh"

# Kill current steve
printf "Killing current instance of Steve..."
pkill -f "steve.sh"
pkill -f "sh steve.sh"
printf " done\n"

# make a new steve as fast as possible to minimize downtime
echo "Reviving Steve..."
sh "steve.sh"

