# Steve the Telegram Bot
A bot for RoboBibb's telegram groupchat. This bot is programmed for node.js and will be deploied onto a raspberry pi soon.

## Commands 
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
  + anthing else gets writen to the logs in stdout so that we can see what their message.
## Responses
- "is steve a human?" - replies "yes" and asks person who was wondering to complete a captcha
- "shutup steve" - replies "no thx"
