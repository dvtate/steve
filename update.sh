#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime

echo "Steve is redefining himself... updating sources from GitHub"

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
