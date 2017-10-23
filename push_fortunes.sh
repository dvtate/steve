#!/bin/sh

####
## This commits all of the new fortunes they added
##


## get new repo
echo "cloning into repo..."
rm -rf "robobibb-steve-bot"
git clone "git+ssh://git@github.com/robobibb/robobibb-steve-bot.git"
cd "robobibb-steve-bot"

# make changes
printf "updating fortunes.txt... "
cat "../assets/fortunes.txt" > "assets/fortunes.txt"
echo "done"

# commit changes
git add "assets/fortunes.txt"
git commit -m "$1"
git push

# cleanup
cd ".."
rm -rf "robobibb-steve-bot"


