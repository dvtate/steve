#!/bin/sh

# gets run before Steve is started
function init {
	printf "Steve - Hello\n"
}

# gets run after Steve is ended
function cleanup {
	printf "\nSteve - Goodbye\n"
}

# run before starting
init

# run cleanup before exiting
trap cleanup EXIT

# start steve
TELEGRAM_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 node index.js

# this should never get run
echo "error"
