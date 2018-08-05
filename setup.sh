#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

## make everything runable
printf "marking scripts as runable..."
chmod +x setup.sh update.sh steve.sh push_fortunes.sh ws_setup.sh ws_cleanup.sh
printf " done\n"


printf "making ~/.steve..."
mkdir "$HOME/.steve"
echo "done"

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ ! -f $HOME/.steve/tg_key ]; then
	# get bot token
	printf "Enter your Telegram Bot API token: "
	read TELEGRAM_TOKEN

    # put token into config dir
    printf "inserting token into ur ~/.steve/tg_key... "
    echo $TELEGRAM_TOKEN > $HOME/.steve/tg_key

    echo "done"
fi


# github login details
if [ ! -f $HOME/.steve/gh_key ]; then
	# get login
	printf "enter username:"
	read GH_UN
	printf "enter passwd:"
	read GH_PW
	
	printf "inserting credentials into ~/.steve/gh_key... "
	echo $GH_UN > $HOME/.steve/gh_key
	echo $GH_PW >> $HOME/.steve/gh_key
	echo "done"

fi

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ ! -f $HOME/.steve/slack_key ]; then
	# get bot token
	printf "Enter your Slack Token (xoxb-...): "
	read SLACK_TOKEN

    # put token into config dir
    printf "inserting token into ur ~/.steve/slack_key ... "
    echo $SLACK_TOKEN > $HOME/.steve/slack_key

    echo "done"
fi

# install dependencies
echo "installing dependencies..."
npm install --save node-telegram-bot-api node-datetime open-exchange-rates money time @slack/client @slack/events-api lunicode-creepify lunicode-tiny lunicode-flip lunicode-mirror
echo "installed dependencies"
