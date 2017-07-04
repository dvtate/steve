#!/bin/sh

## This script automatically sets everything up for you so
## to be run upon cloneing the repo

chmod +x update.sh steve.sh

# get bot token
printf "Enter your Telegram Bot API token: "
read token

# put token into steve.sh
sed -i "s/^export TELEGRAM_TOKEN=.*/export TELEGRAM_TOKEN=${token}/" steve.sh

# install dependencies
npm install --save package.json
