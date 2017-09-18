# Steve the Telegram Bot
A bot for RoboBibb's telegram groupchat. This bot is programmed for node.js and will be deployed onto a Raspberry Pi soon.

## How to use:
### Deployment:
The included `setup.sh` script gets everything ready to go. All you need to do is enter the Telegram bot token from the botfather. After setup you can run `steve.sh` to start the bot.
```
$ git clone https://github.com/robobibb/robobibb-steve-bot/ && cd robobibb-steve-bot/
$ sh setup.sh
$ ./steve.sh
```
### Updating:
Like many things on the internet, uptime is very important. In order to update the bot with essentially no noticeable down-time, you can run `update.sh`. Which will automatically update the bot from this github repo. 

## Commands:
- `/ping` - replies `pong` as soon as possible (for testing connection [speed])
- `/echo <message>` - repeats `<message>`
- `/cat` - sends a random cat picture
- `/join` - helps user get into team group chats
- `/help` - shows help dialogue
- `/coinflip` - flips a coin and sends result
- `/random` - random number generator. 
  + given 2 numbers gives a number on the range [num1, num2)
  + given one number gives a number on the range [0, num1) 
- `/log` - logs a message.
  + if message is `__msg_id` it logs the id of the message the command is a response to.
  + if message is `__chat_id` it logs the id of the chat the command was sent from.
  + if message is `__from_id` it logs the user id of the sender of the message [or message replied to]
  + if message is `__msg_` it logs the entire message object to stdout
  + anthing else gets writen to the logs in stdout so that sysadmin can see their message.
- `/update` - runs `update.sh` and updates Steve's code.
- `/system <command>` - runs a command on the system (requires authorization)
- `/sshcmd` - gives a ssh command to run (requires authorization)
- `/fortune` - sends an interesting quote/fortune
- `/addfortune <fortune message>` - add your own fortune message
- `/vaporwave <text>` - converts to full-width text
- `/xkcd` - sends a random xkcd comic
- `/poll` - makes a voteable poll for your message. (+1,-1, ±0)

*Authorization: being in one of the team's main chats or being a designated Admin
## Responses:
- "is steve a human?" - replies "yes" and asks person who was wondering to complete a captcha
- "shutup steve" - replies "no thx"

## Chat Events:
- on new member: welcomes the new member to the chat
