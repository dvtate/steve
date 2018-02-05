#!/bin/sh

## this script is used to run the bot
## in addition it helps to maintain privacy of our bot tokens

echo "starting steve..."

# get keys from fs
export TG_KEY=$(cat $HOME/.steve/tg_key)
export SLACK_KEY=$(cat $HOME/.steve/slack_key)

# start bot
node index.js

echo "bot died?"
