"use strict";

const request = require("request");
const fs = require("fs");

const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(TOKEN, { polling: true });

// chats
const officialChatID = "-1001065686661";
const mainChatID = "-1001065686661";

// returns true if the given user id is in our 2 main chats
function isTeamMember(userId) {
	return bot.getChatMember(officialChatID, userId).then(
			function (val) { return val.status != "left"; },
			function (val) { return false; })
		|| bot.getChatMember(mainChatID, userId).then(
			function (val) { return val.status != "left"; },
			function (val) { return false; })
}

// help dialog
bot.onText(/\/help/, function(msg) {
	bot.sendMessage(msg.chat.id, "Steve is RoboBibb's telegram automation bot. "
	+ "He provides some useful funcitons and some useless ones.\n\n"
	+ "/cat - gives a random cat picture\n"
	+ "/echo <message> - steve repeats <message>\n"
	+ "/ping - tests the connection and speed\n"
	+ "/join - helps you get into our group chats\n"
	+ "/coinflip - flips a coin and sends the result\n"
	+ "/random - random number generator numbers come after for ranges\n");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") asked for /help");
});

// send a random cat pic
bot.onText(/\/cat/, function(msg) {
	const img = request("http://lorempixel.com/400/200/cats/");
	bot.sendPhoto(msg.chat.id, img, { caption: "look at the kitty!" });
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") likes /cat's");
});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function(msg, match) {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp);
  console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") echo'd");
});


// ping response testing
bot.onText(/\/ping/, function onPing(msg) {
	bot.sendMessage(msg.chat.id, "pong");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") ping'd");
});


// user wants to join a chat
bot.onText(/\/join/, function onJoinRequest(msg) {
	const opts = {
		reply_markup: {
			inline_keyboard: [
				[ { text: "RoboBibb Offical", callback_data: "offical" } ],
				[ { text: "Programming team", callback_data: "code" } ],
				[ { text: "Website team", callback_data: "web" } ]
			]
		},
		reply_to_message_id : msg.message_id
	};
	bot.sendMessage(msg.chat.id, "Which chat do you want to join?", opts);
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") requested to join");
});



// Handle callback queries
bot.on("callback_query", function(callbackQuery) {
	const action = callbackQuery.data;
	const msg = callbackQuery.message;
	const usr = callbackQuery.from;
	const opts = {
		chat_id: msg.chat.id,
		message_id: msg.message_id,
	};
	let text;

	// from '/join 4941'
	if (action === "offical") {
		//bot.sendMessage(msg.chat.id, "contact @ridderhoff and he will add you to the offical chat.");
		text = "@ridderhoff has been contacted and will try to add you to the chat"
		bot.sendMessage("147617508", usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join offical");
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join offical");
	} else if (action === "code") {
		//bot.sendMessage(msg.chat.id, "click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA");
		text = "Click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA"
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join programming");
	} else if (action === "web") {
		//bot.sendMessage(msg.chat.id, "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ");
		text = "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ";
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join web team");
	}

	bot.editMessageText(text, opts);

	// 147617508 = @ridderhoff
	bot.forwardMessage("147617508", msg.chat.id, msg.reply_to_message.message_id);
 });

// coin flip
bot.onText(/\/coinflip/, function(msg) {
	if (Math.random() > 0.5)
		bot.sendMessage(msg.chat.id, "heads");
	else
		bot.sendMessage(msg.chat.id, "tails");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") flipped a coin.");
});

// random number generator
bot.onText(/\/random(.+)?/, function onEchoText(msg, match) {
	const args = match[1];
	var lims = args.split(/ |,/);
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" +
				msg.from.username + ") random :: " + lims);

	if (lims.length == 1) {
		const min = 0;
		const max = Math.floor(Number(lims[0]))
		bot.sendMessage(msg.chat.id, "random number = " + (Math.floor(Math.random() * (max - min)) + min));
	} else if (lims.length == 2) {
		const min = Math.ceil(Number(lims[1]));
		const max = Math.floor(Number(lims[0]));
		bot.sendMessage(msg.chat.id, "random number = " + (Math.floor(Math.random() * (max - min)) + min));
	} else {
		bot.sendMessage(msg.chat.id, "`/random <num1>` -> random number (0 <= n < num1)\n"
									+"`/random <num1> <num2>` -> random number (num1 <= n <= num2");
	}

});

// logs are useful for debugging
bot.onText(/\/log (.+)/, function(msg, match){
	const args = match[1];
	if (args == "__chat_id") {
		bot.sendMessage(msg.chat.id, "logged chat id = " + msg.chat.id);
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") logged chatid: " + msg.chat.id);
	} else if (args == "__msg_id") {
		if (!msg.reply_to_message) {
			bot.sendMessage("Error: message isn't a reply.");
			console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") failed to make a log");
		} else {
			bot.sendMessage(msg.chat.id, "logged message id = " + msg.reply_to_message.message_id)
			console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") logged msg_id: " + msg.reply_to_message.message_id);
		}
	} else {
		bot.sendMessage(msg.chat.id, "Wrote a log - \"" + args + "\"");
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") wrote a log: \"" + args + "\"");
	}
});



// Welcome new members :)
bot.on("new_chat_participant", function (msg) {
	console.log("new user(s):");
	msg.new_chat_members.forEach(function(new_member) {
		bot.sendMessage(msg.chat.id, "Welcome to " + msg.chat.title + ", " + new_member.first_name + "!");
		console.log("   " + new_member.first_name + " " + new_member.last_name + " (@" + new_member.username + "), ");
	});

});




/// emulating humans


// just to confuse people
bot.onText(/is steve (?:a\s)?human\?/i, function (msg) {
	bot.sendMessage(msg.chat.id, "Yes", { reply_to_message_id : msg.message_id });
	const img = request("http://www.seosmarty.com/wp-content/uploads/2009/05/captcha-7.jpg");
	bot.sendPhoto(msg.chat.id, img, { caption: "Are YOU a human? proove it!" });
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") suspects I'm an AI");
});


// ofc we follow instructions
bot.onText(/shutup steve|steve shutup/, function shutup(msg) {
	bot.sendMessage(msg.chat.id, "No thx", { reply_to_message_id : msg.message_id });
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") told me to shutup");
});

// hey siri
bot.onText(/^(?:hey\s|hi\s)?steve(?:\.|\?|\!)?$/i, function (msg){
	bot.sendMessage(msg.chat.id, "I have been summoned");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") got my attention.");
});

// this is a reference to 2001 space oddysey
bot.onText(/(?:hey\s)?steve(?:\.|\?|\!|\,)?.?make me a sandwich/i, function (msg) {
	bot.sendAudio(msg.chat.id, "assets/cantdo.mp3",	{
		caption : "I'm afraid I can't do that...",
		reply_to_message_id : msg.message_id
	});
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") wants a sandwich");
});

bot.onText(/\/newreply/, function(msg) {
	const args = msg.text.split("\n");
	if (isTeamMember(msg.from.id)) {

		if (args.length < 2) {
			bot.sendMessage(msg.chat.id, "malformed /newcommand, are you supposed to be doing this?")
		} else {
			if (args[0] == "/newreply adv") {

			} else if (args[0] == "/newreply") {
				// format the info
				//
				/* append it to file
				fs.appendFile('assets/user_commands.txt', 'data to append', function (err) {
				  if (err) throw err;
				  console.log('Saved!');
				});*/

				// attempt PR on GH???
			}
		}

	} else {
		bot.sendMessage(msg.chat.id, "You are not authorized to complete this action")

	}
});
