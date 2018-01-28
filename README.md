# Steve the Telegram Bot
A bot for RoboBibb's telegram groupchats. This bot is programmed for node.js and runs on a Raspberry pi. Message steve [here](https://t.me/robobibb_bot).

## How to use:
### Deployment:
The included `setup.sh` script gets everything ready to go. All you need to do is enter the Telegram bot token from the botfather. After setup you can run `steve.sh` to start the bot.
```
$ git clone https://github.com/robobibb/steve/ && cd steve/
$ sh setup.sh
$ ./steve.sh
```
### Updating:
Like many things on the internet, uptime is very important. In order to update the bot with essentially no noticeable down-time, you can run `update.sh`. Which will automatically update the bot from this github repo. 

## Commands:
- `/exchange <amt> <from> <to>` - converts currencies
- `/timzeone <timezone>` - tells current time in <timezone>
- `/ping` - replies `pong` as soon as possible (for testing connection)
- `/echo <message>` - repeats `<message>`
- `/cat` - sends a random cat picture
- `/join` - helps user get into team group chats
- `/help` - shows help dialog
- `/coinflip` - flips a coin and sends result
- `/random` - random number generator. 
  + given 2 numbers gives a number on the range \[num1, num2)
  + given one number gives a number on the range \[0, num1) 
- `/log` - logs a message.
  + if message is `__msg_id` it logs the id of the message the command is a response to.
  + if message is `__chat_id` it logs the id of the chat the command was sent from.
  + if message is `__from_id` it logs the user id of the sender of the message [or message replied to]
  + if message is `__msg_` it logs the entire message object to stdout
  + anthing else gets writen to the logs in stdout so that sysadmin can see their message.
- `/update` - runs `update.sh` and updates Steve's code.
- `/8ball` - responds with "Yes", "No" or "Maybe" (not always correct)
- `/fortune` - sends an interesting quote/fortune
- `/vaporwave <text>` - converts to full-width text
- `/xkcd` - sends a random xkcd comic
- `/xkcd <comic number>` - sends xkcd number \<comic number>
- `/xkcd latest` - sends most recent xkcd comic strip
- `/poll` - makes a voteable poll for your message. (+1,-1, ±0)
- `/website` - link to [our team website](https://robobibb.github.io/)
- `/sm` - social media links
- `/leave` - remove steve from GC.

### Require authorization
These require that you are either in the administrator list or are currently in one of the two RoboBibb General Discussion groupchats.
- `/addfortune <fortune message>` - add your own fortune message
- `/system <command>` - runs a command on the system (requires authorization)
- `/sshcmd` - gives a ssh command to run (requires authorization)
- `/postupdate <category>` - send this as a response to your update.zip file. Steve will automatically post your story to [robobibb.github.io/updates/](https://robobibb.github.io/updates/)
- `/msg <chat/userID> <message contents>` - sends a message to userID, user must already be in a GC/DM with steve for this to work.
- `/eval <code>` - runs javascript code

## Responses:
messages which could be directed to anyone must be started with `steve,` or anything from `(?:hey\s)?steve(?:\.|\?|\!|\,)?.?`
- "is steve a human?" - replies "yes" and asks person who was wondering to complete a captcha
- "shutup steve" - replies "no thx"
- "make me a sandwitch" - sends a sound clip "I'm sorry dave I'm afraid I can't do that" from 2001 space odyssey
- "sudo make me a sandwitch" - replies "you're a sandwitch"
- "shutup steve" - replies "no thx"

## Chat Events:
- on new member: welcomes the new member to the chat
