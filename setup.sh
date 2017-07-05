#!/bin/sh

## This script automatically sets everything up for you so
## to be run upon cloneing the repo

## make everything runable
printf "marking scripts as runable..."
chmod +x setup.sh update.sh steve.sh
printf " done\n"

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ -z "$TELEGRAM_TOKEN" ]; then
	# get bot token
	printf "Enter your Telegram Bot API token: "
	read TELEGRAM_TOKEN
fi

# put token into steve.sh
sed -i "s/^export TELEGRAM_TOKEN=.*/export TELEGRAM_TOKEN=${TELEGRAM_TOKEN}/" steve.sh

# install dependencies
echo "installing dependencies..."
npm install --save node-telegram-bot-api
