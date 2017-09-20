"use strict";

const request = require("request");
const fs = require("fs");

const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(TOKEN, { polling: true });

// chats
const officialChatID = "-1001065686661";
const mainChatID = "-1001065686661";

const codeChatID = "-1001070098331";


// collaborators who might not be in the official chats
const adminIDs = [ 147617508 // tate (main)
		 		 ];


// help dialog
bot.onText(/\/help/, function(msg) {
	bot.sendMessage(msg.chat.id, "Steve is RoboBibb's telegram automation bot. "
	+ "He provides some useful funcitons and some useless ones.\n\n"
	+ "/cat - gives a random cat picture\n"
	+ "/echo <message> - steve repeats <message>\n"
	+ "/ping - tests the connection and speed\n"
	+ "/join - helps you get into our group chats\n"
	+ "/coinflip - flips a coin and sends the result\n"
	+ "/random - random number generator numbers come after for ranges\n"
	+ "/log - log a value/message (ie- `__chat_id`, `__from_id`, `__msg_id`, `__msg_`)\n"
	+ "/system - runs a command on the system (use with caution)\n"
	+ "/fortune - opens a fortune cookie\n"
	+ "/addfortune <fortune message> - adds a fortune to the pool\n"
	+ "/sshcmd - get a command to run to ssh into the server\n"
	+ "/vaporwave <text> - converts normal text to full-width text\n"
	+ "/xkcd - gives a random XKCD comic strip\n"
	+ "/msg <user/chat id #> <message> - sends a message to the given chat\n\n"
	+ "more at: https://github.com/robobibb/robobibb-steve-bot/");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") asked for /help");
});

// send a random cat pic
bot.onText(/^\/cat/, function(msg) {
	const img = request("http://lorempixel.com/400/200/cats/");
	bot.sendPhoto(msg.chat.id, img, { caption : "look at the kitty!" });
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") likes /cat's");
});

// sends a random XKCD comic strip
bot.onText(/^\/xkcd$/, function(msg) {
	request("https://c.xkcd.com/random/comic/", function (error, response, body) {
		if (error) {
			console.log("/xkcd - error: ", error);
			console.log("\tstatusCode:", response && response.statusCode);
			bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
			return;
		}
		const imgurl = body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1];
		const cstrip = request("https:" + imgurl);
		bot.sendPhoto(msg.chat.id, cstrip, {
			reply_to_message_id : msg.message_id,
			caption : body.match(/<div id="ctitle">(.+?)<\/div>/)[1]
		});
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") read /xkcd");
	});
});

// sends a random XKCD comic strip
bot.onText(/^\/xkcd ([\S\s]+)/, function(msg,match) {
	request("https://xkcd.com/" + match[1], function (error, response, body) {
		if (error) {
			console.log("/xkcd - error: ", error);
			console.log("\tstatusCode:", response && response.statusCode);
			bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
			return;
		}
		if (!body.match(/<div id="comic">\n<img src="(.+?)"\s/)) {
			console.log("invalid /xkcd number");
			bot.sendMessage(msg.chat.id, "invalid xkcd comic number", { reply_to_message_id : msg.message_id });
			return;
		}
		const imgurl = body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1];
		const cstrip = request("https:" + imgurl);
		bot.sendPhoto(msg.chat.id, cstrip, {
			reply_to_message_id : msg.message_id,
			caption : body.match(/<div id="ctitle">(.+?)<\/div>/)[1]
		});
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") read /xkcd");
	});
});

// Matches /echo [whatever]
bot.onText(/^\/echo ([\S\s]+)/, function(msg, match) {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp, { reply_to_message_id : msg.message_id });
  console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") echo'd");
});


// ping response testing
bot.onText(/^\/ping/, function onPing(msg) {
	bot.sendMessage(msg.chat.id, "pong");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") ping'd");
});


bot.onText(/^\/poll/, function (msg) {
	const repID = msg.reply_to_message ? msg.reply_to_message.message_id : msg.message_id;
	const opts = {
		reply_markup : {
			inline_keyboard: [
				[ 	{ text: "+1", callback_data: "upvote" },
					{ text: "-1", callback_data: "downvote" } ],
				[ { text: "¯\\_(ツ)_/¯", callback_data: "idc" } ]
			]
		},
		reply_to_message_id : repID
	};
	bot.sendMessage(msg.chat.id, "vote here:\n +1 : 0\n -1 : 0\n ±0 : 0", opts);
});

// user wants to join a chat
bot.onText(/^\/join/, function onJoinRequest(msg) {
	const opts = {
		reply_markup: {
			inline_keyboard: [
				[ { text: "RoboBibb Offical", callback_data: "offical" } ],
				[ { text: "Programming team", callback_data: "code" } ],
				[ { text: "Website team", callback_data: "web" } ],
				[ { text: "Bot Spammers", callback_data: "bots" } ],
				[ { text: "Proxy/VPN Users", callback_data: "proxy" } ]
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
		message_id: msg.message_id
	};

	// from '/join'
	if (action === "offical") {
		//bot.sendMessage(msg.chat.id, "contact @ridderhoff and he will add you to the offical chat.");
		const text = "@ridderhoff has been contacted and will try to add you to the chat"
		bot.editMessageText(text, opts);
		bot.sendMessage("147617508", usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join offical");

		// 147617508 = @ridderhoff (Tate) (gh@dvtate)
		bot.forwardMessage("147617508", msg.chat.id, msg.reply_to_message.message_id);

		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join offical");

	} else if (action === "code") {
		//bot.sendMessage(msg.chat.id, "click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA");
		const text = "Click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA"
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join programming");
		bot.editMessageText(text, opts);
	} else if (action === "web") {
		//bot.sendMessage(msg.chat.id, "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ");
		const text = "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ";
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join web team");
		bot.editMessageText(text, opts);
	} else if (action === "bots") {
		const text = "click here to join the bot spam chat: https://t.me/joinchat/CMx25A4N48cfJuFRTTdwPg";
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join bot spammers");
		bot.editMessageText(text, opts);
	} else if (action === "proxy") {
		const text = "click here to get passed the firewall: https://t.me/joinchat/CMx25EC8RpXQvjLa8cMmVA";
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join MaconShadowsocks society");
		bot.editMessageText(text, opts);
	}

	// from /poll
	else if (action === "upvote") {
		const upNum = parseInt(msg.text.match(/\+1 : ([0-9]+?)\n/)[1]);

		const opts = {
			reply_markup : {
				inline_keyboard: [
					[ 	{ text: "+1", callback_data: "upvote" },
						{ text: "-1", callback_data: "downvote" } ],
					[ { text: "¯\\_(ツ)_/¯", callback_data: "idc" } ]
				]
			},
			chat_id: msg.chat.id,
			message_id: msg.message_id
		};


		bot.editMessageText(msg.text.replace(/\+1 : [0-9]+/, "+1 : " + (upNum + 1)), opts);

	} else if (action == "downvote") {
		const downNum = parseInt(msg.text.match(/\-1 : ([0-9]+?)\n/)[1]);

		const opts = {
			reply_markup : {
				inline_keyboard: [
					[ 	{ text: "+1", callback_data: "upvote" },
						{ text: "-1", callback_data: "downvote" } ],
					[ { text: "¯\\_(ツ)_/¯", callback_data: "idc" } ]
				]
			},
			chat_id: msg.chat.id,
			message_id: msg.message_id
		};
		bot.editMessageText(msg.text.replace(/-1 : [0-9]+/, "-1 : " + (downNum + 1)), opts);

	} else if (action == "idc") {
		const idcNum = parseInt(msg.text.match(/0 : ([0-9]+?)/)[1]);

		const opts = {
			reply_markup : {
				inline_keyboard: [
					[ 	{ text: "+1", callback_data: "upvote" },
						{ text: "-1", callback_data: "downvote" } ],
					[ { text: "¯\\_(ツ)_/¯", callback_data: "idc" } ]
				]
			},
			chat_id: msg.chat.id,
			message_id: msg.message_id
		};
		bot.editMessageText(msg.text.replace(/0 : [0-9]+/, "0 : " + (idcNum + 1)), opts);

	}


});


// gives our sm links
bot.onText(/^\/sm/, function (msg) {
	bot.sendMessage(msg.chat.id,
			"Check out our social media accounts:\n"
			+ "FaceBook: https://fb.com/teamrobobibb/\n"
			+ "Twitter: https://twitter.com/FRC4941\n"
			+ "Instagram: https://t.co/K8QYQHTEgu\n"
			+ "GitHub: https://github.com/RoboBibb/\n"
			+ "Email: frcteam4941@gmail.com / code4941@gmail.com",
			{ reply_to_message_id : msg.message_id });

	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") asked for our social media.");
});

// gives our website link
bot.onText(/^\/website/, function (msg) {
	bot.sendMessage(msg.chat.id,
			"Check out our website: https://robobibb.github.io/",
			{ reply_to_message_id : msg.message_id });

	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") asked for website URL.");
});

// random number generator
bot.onText(/^\/random (.+)?/, function onEchoText(msg, match) {
	const args = match[1];
	var lims = args.split(/ |,|\n/);
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" +
				msg.from.username + ") random :: " + lims);

	var rand;
	if (lims.length == 1) {
		const min = 0;
		const max = Math.floor(Number(lims[0]))
		rand = (Math.floor(Math.random() * (max - min)) + min);
	} else if (lims.length == 2) {
		const min = Math.ceil(Number(lims[1]));
		const max = Math.floor(Number(lims[0]));
		rand = (Math.floor(Math.random() * (max - min)) + min);
	} else
		rand = NaN;


	if (rand == NaN)
		bot.sendMessage(msg.chat.id, "`/random <num1>` -> random number (0 <= n < num1)\n"
									+"`/random <num1> <num2>` -> random number (num1 <= n <= num2");
	else
		bot.sendMessage(msg.chat.id, "random number = " + rand);

});

// coin flip
bot.onText(/^\/coinflip/, function(msg) {
	if (Math.random() > 0.5)
		bot.sendMessage(msg.chat.id, "heads");
	else
		bot.sendMessage(msg.chat.id, "tails");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") flipped a coin.");
});

// logs are useful for debugging
bot.onText(/^\/log (.+)/, function(msg, match){
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
	} else if (args == "__from_id") {
		if (!msg.reply_to_message) {
			bot.sendMessage(
				msg.chat.id,
				"logged user id = " + msg.from.id,
				{ reply_to_message_id : msg.message_id }
			);
			console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") logged user_id: " + msg.from.id);

		} else {
			bot.sendMessage(
				msg.chat.id,
				"logged user id = " + msg.reply_to_message.from.id,
				{ reply_to_message_id : msg.reply_to_message.message_id }
			);
			console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") logged user_id: " + msg.reply_to_message.from.id);
		}
	} else if (args == "__msg_") {
		bot.sendMessage(msg.chat.id, "logged message object");
		console.log(msg);
	} else {
		bot.sendMessage(msg.chat.id, "Wrote a log - \"" + args + "\"");
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") wrote a log: \"" + args + "\"");
	}
});

bot.onText(/^\/msg ([\S\s]+)/, function(msg, match) {
	const args = match[1].split(/ |,|\n/);
	if (args.length < 2) {
		bot.sendMessage(msg.chat.id, "The correct syntax for /msg is as follows:\n"
						+ " /msg <user id number> <message contents>",
						{ reply_to_message_id : msg.message_id } );
	} else {
		bot.sendMessage(args[0], args[1] + "\n\n**From user#" + msg.from.id + " via /msg.**", {
			parse_mode : "markdown"
		});
		bot.sendMessage(msg.chat.id, "Message sent.", { reply_to_message_id : msg.message_id } );
		console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") sent a /msg to " + args[0] + " : " + args[1]);
	}

});

// similar to the fortune terminal command
bot.onText(/^\/fortune/, function(msg) {

	bot.sendMessage(msg.chat.id,
			require("./fortune.js").getText(),
			{
				reply_to_message_id : msg.message_id,
				parse_mode : "markdown"
			} );

	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") recieved a fortune");

});

// adds a fortune to our list
bot.onText(/^\/addfortune ([\S\s]+)/, function(msg, match) {
	require("./fortune.js").addFortune(match[1]);
	bot.sendMessage(msg.chat.id,
			"Added fortune: " + match[1],
			{ reply_to_message_id : msg.message_id } );

	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") added a fortune");

});

// gives vaporwave equivalent text
bot.onText(/^\/vaporwave (.+)/, function(msg, match) {
	bot.sendMessage(msg.chat.id,
		require("./vaporwave.js").toVaporwave(match[1]),
		{ reply_to_message_id : msg.message_id });

	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") converted text to vaporwave");
});



// Welcome new members :)
bot.on("new_chat_participant", function (msg) {
	console.log("new user(s):");
	msg.new_chat_members.forEach(function(new_member) {
		bot.sendMessage(msg.chat.id, "Welcome to " + msg.chat.title + ", " + new_member.first_name + "!");
		console.log("  * " + new_member.first_name + " " + new_member.last_name + " (@" + new_member.username + "), joined  "
			    + msg.chat.title);
	});
});


var updating = false; // only one update process at a time
// update steve to latest version
bot.onText(/^\/update/, function (msg) {
	bot.sendMessage(msg.chat.id, "Updating my source code from https://github.com/robobibb/robobibb-steve-bot... There should be zero downtime");
	if (!updating) {
		console.log("spawning update.sh...");
		updating = true;

		// run command `sh update.sh` which will update Steve, eventually killing this version of him
		require("child_process").fork("./update.sh");

		console.log("spawned");
	}
});







/// emulating humans

// just to confuse people
bot.onText(/^is steve (?:a\s)?human\?/i, function (msg) {
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
	bot.sendAudio(msg.chat.id, "assets/sound_files/cantdo.mp3",	{
		caption : "I'm afraid I can't do that...",
		reply_to_message_id : msg.message_id
	});
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") wants a sandwich");
});


function addCommand(msg) {
	const args = msg.text.split("\n");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") tried to make a new command");
	if (args.length < 2) {
		bot.sendMessage(msg.chat.id, "malformed /newreply, are you supposed to be doing this?")
	} else {
		if (args[0] == "/newreply adv") {

		} else if (args[0] == "/newreply") {

			/** how these will work
			* - take their prompt, and escape all chars
			* - add it to user_cmds.txt
			* - add their resp to user_resps.txt
			* - these will be called in the /hey steve/ event
			*/

			/*
						// format the info

			fs.appendFile('assets/user_commands.txt', 'data to append', function (err) {
			  if (err) throw err;
			  console.log('Saved!');
			});*/
			// attempt PR on GH???
		}
	}

}

bot.onText(/^\/newreply/, function(msg) {
/*
	// arrow functions are baller
	bot.getChatMember(officialChatID, msg.from.id)
		.then(usr_ret0 => {
			if (usr_ret0.status != "left") {
				addCommand(msg);
			} else {
				bot.getChatMember(mainChatID, msg.from.id)
					.then(usr_ret1 => {
						if (usr_ret1.status != "left") {
							addCommand(msg);
						} else {
							console.log(msg.from.first_name + " " + msg.from.last_name
							+ " (@" + msg.from.username + ") wasn't allowed to make a command");
							bot.sendMessage(msg.chat.id, "you are not authorized to run this command");
						}
					}).catch(err => console.log("strange error: 1A"));
			}
		}).catch(err => console.log("strange error: 1B"));
*/
		authorized(msg.from.id,
			function () { addCommand(msg); },
			function () {
				console.log(msg.from.first_name + " " + msg.from.last_name
				+ " (@" + msg.from.username + ") wasn't allowed to make a command");
				bot.sendMessage(msg.chat.id, "you are not authorized to run this command");
			}
		);
});



function authorized(usrID, isAuth, notAuth) {
	if (adminIDs.includes(usrID)) {
		isAuth();
	} else {
		bot.getChatMember(officialChatID, usrID)
			.then(usr_ret0 => {
				if (usr_ret0.status != "left") {
					isAuth();
				} else {
					bot.getChatMember(mainChatID, usrID)
						.then(usr_ret1 => {
							if (usr_ret1.status != "left") {
								isAuth();
							} else {
								notAuth();
							}
						})
							.catch(err => console.log("strange authentication error: 1A -->" + err));
				}
			})
				.catch(err => console.log("strange error: authentication 1B -->" + err));
	}
}


/// interface to the server
bot.onText(/^\/system (.+)/, function(msg, match){
	const command = match[1];
	authorized(msg.from.id,
		function () {
			console.log(msg.from.first_name + " " + msg.from.last_name
			+ " (@" + msg.from.username + ") ran command: `" + command + "`");
			require("child_process").exec(command, function(error, stdout, stderr){
				bot.sendMessage(msg.chat.id, "alarm@alarmpi $ " + command + '\n' + stdout);
			});
		},
		function () {
			console.log(msg.from.first_name + " " + msg.from.last_name
			+ " (@" + msg.from.username + ") was prevented from running a command (unauthorized)");
			bot.sendMessage(msg.chat.id, "you are not authorized to run commands");
		}
	);

});

bot.onText(/^\/sshcmd/, function(msg) {
	authorized(msg.from.id,
		function () {
			request("https://ipinfo.io", function (error, response, body) {
				if (!error && response.statusCode == 200) {

					bot.sendMessage(msg.chat.id, "$ ssh alarm@"
									+ JSON.parse(body).ip
									+ "\nYou should know the password");

					console.log(msg.from.first_name + " " + msg.from.last_name
								+ " (@" + msg.from.username
								+ ") was given an ssh command to run.");
				} else {
					console.log("Curl Error "+response.statusCode);
					bot.sendMessage(msg.chat.id, "there was an error verifying my ip address... " + response.statusCode);
				}
			});
		},
		function () {
			console.log(msg.from.first_name + " " + msg.from.last_name
			+ " (@" + msg.from.username + ") was prevented from getting a ssh command");
			bot.sendMessage(msg.chat.id, "you are not authorized for ssh access");
		}
	);

});
