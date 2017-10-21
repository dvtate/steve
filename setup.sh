#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

## make everything runable
printf "marking scripts as runable..."
chmod +x setup.sh update.sh steve.sh push_fortunes.sh
printf " done\n"

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ -z "$TELEGRAM_TOKEN" ]; then
	# get bot token
	printf "Enter your Telegram Bot API token: "
	read TELEGRAM_TOKEN
fi

: '
# if token wasnt exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ -z "$GH_TOKEN" ]; then
	# get bot token
	printf "Enter your GitHub API token: "
	read GH_TOKEN
fi
'

# put token into steve.sh
printf "inserting token into steve.sh... "
sed -i "s/^export TELEGRAM_TOKEN=.*/export TELEGRAM_TOKEN=${TELEGRAM_TOKEN}/" steve.sh
sed -i "s/^export GH_TOKEN=.*/export GH_TOKEN=${GH_TOKEN}/" steve.sh
printf "done\n"

# install dependencies
echo "installing dependencies..."
npm install --save node-telegram-bot-api github node-datetime download
echo "installed dependencies"

