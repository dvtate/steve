#!/bin/sh

####
## This commits all of the new fortunes they added
##


## get new repo
echo "cloning into repo..."
rm -rf "robobibb-steve-bot"
git clone "git+ssh://git@github.com/robobibb/robobibb-steve-bot.git"
cd "robobibb-steve-bot"

 "updating fortunes.txt... "
# make changes
cat "../assets/fortunes.txt" > "assets/fortunes.txt"

# commit changes
git add "assets/fortunes.txt"
git commit -m "update fortunes"
git push

# cleanup
cd ".."
rm -rf "robobibb-steve-bot"
