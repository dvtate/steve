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
const adminIDs = [ 46580443,	// k3 (gh@Technohacker) (tg@Technohackr
				   222598812	// umar (gh@humarh-dharnarh) (tg@Humarh_Dharnarh)
				 ];

// Function to simplify logging
function logCmd(msg, logMessage) {
	const timestamp = require("node-datetime").create().format("[Y-m-d@H:M:S]");
	const entry = `${timestamp}: ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) ${logMessage}`;
	fs.appendFile("steve_useage.log", entry + '\n', (err) => {
		if (err)
			throw err;
		console.log(entry);
	});
}

// is the user trustworthy enough for advanced commands?
// isAuth() called if trustworthy
// notAuth() called otherwise
function authorized(usrID, isAuth, notAuth) {
	// they're an admin ?
	if (adminIDs.includes(usrID))
		isAuth();
	else // in the offical gc ?
		bot.getChatMember(officialChatID, usrID)
			.then(usr_ret0 => {
				if (usr_ret0.status != "left")
					isAuth();
				else // in the unoffical gc ?
					bot.getChatMember(mainChatID, usrID)
						.then(usr_ret1 => {
							if (usr_ret1.status != "left")
								isAuth();
							else
								notAuth();
						}).catch(err => console.log("strange authentication error: 1A --> ", err));
			}).catch(err => console.log("strange error: authentication 1B -->", err));
}


// help dialog
bot.onText(/\/help(?:@robobibb_bot)?/, msg => {
	bot.sendMessage(msg.chat.id, `
Steve is RoboBibb\'s telegram automation bot
He automates a variety of tasks an provides utilities for the members of our group chats.


/cat - gives a random cat picture
/echo <message> - steve repeats <message>
/ping - tests the connection and speed
/join - helps you get into our group chats
/8ball <question> - answers 'Yes', 'No' or 'Maybe' to your question (accept with a pinch of salt)
/coinflip - flips a coin and sends the result
/random - random number generator numbers come after for ranges
/log - log a value/message (ie- "__chat_id", "__from_id", "__msg_id", "__msg_")
/fortune - opens a fortune cookie
/vaporwave <text> - converts normal text to full-width text
/xkcd - gives a random XKCD comic strip
/poll - get a feel for the opinions of a group
/exchange <amt> <from> <to> - convert from one currency to another
/leave - remove steve from a GC

Require Authorization:
/addfortune <fortune message> - adds a fortune to the pool
/sshcmd - get a command to run to ssh into the server
/msg <user/chat id #> <message> - sends a message to the given chat
/postupdate <category> - posts update.zip (from reply) onto robobibb.github.io/updates
/system - runs a command on the system (use with caution)
/eval <code> - runs js code
More at: https://github.com/robobibb/steve/
`, { reply_to_message : msg.message_id });
	logCmd(msg, "asked for /help");
});

// send a random cat pic
bot.onText(/^\/cat(?:@robobibb_bot)?(?:$|\s)/, msg => {
	const img = request("http://lorempixel.com/400/200/cats/");
	bot.sendPhoto(msg.chat.id, img, {
		 caption : "look at the kitty!",
		 reply_to_message : msg.message_id
	 });
	logCmd(msg, "likes /cat's");
});

// sends a random XKCD comic strip
bot.onText(/^\/xkcd(?:@robobibb_bot)?$/, msg => {
	request("https://c.xkcd.com/random/comic/", (error, response, body) => {
		if (error) {
			console.log(`/xkcd - error: ${error}`);
			console.log(`    statusCode: ${response && response.statusCode}`);
			bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
			return;
		}
		const imgurl = body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1];
		const cstrip = request(`https:${imgurl}`);
		bot.sendPhoto(msg.chat.id, cstrip, {
			reply_to_message_id : msg.message_id,
			caption : body.match(/<div id="ctitle">(.+?)<\/div>/)[1]
		});
		logCmd(msg, "read /xkcd");
	});
});

// sends a specific XKCD comic strip
bot.onText(/^\/xkcd(?:@robobibb_bot)? ([\S\s]+)/, (msg, match) => {
	let url = `https://xkcd.com/${match[1] === "latest" ? "" : match[1]}`
	request(url, (error, response, body) => {
		if (error) {
			console.log(`/xkcd - error: ${error}`);
			console.log(`    statusCode: ${response && response.statusCode}`);
			bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
			return;
		}
		if (!body.match(/<div id="comic">\n<img src="(.+?)"\s/)) {
			console.log("invalid /xkcd number");
			bot.sendMessage(msg.chat.id, "invalid xkcd comic number", { reply_to_message_id : msg.message_id });
			return;
		}
		const imgurl = body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1];
		const cstrip = request(`https:${imgurl}`);
		bot.sendPhoto(msg.chat.id, cstrip, {
			reply_to_message_id : msg.message_id,
			caption : body.match(/<div id="ctitle">(.+?)<\/div>/)[1]
		});
		logCmd(msg, "read /xkcd");
	});
});

// Matches /echo [whatever]
bot.onText(/^\/echo(?:@robobibb_bot)? ([\S\s]+)/, (msg, match) => {
	const resp = match[1];
	bot.sendMessage(msg.chat.id, resp, { reply_to_message_id : msg.message_id });

	logCmd(msg, "/echo'd text");
});

// ping response testing
bot.onText(/^\/ping(?:@robobibb_bot)?(?:$|\s)/, function onPing(msg) {
	bot.sendMessage(msg.chat.id, "pong", { reply_to_message_id : msg.message_id });
	logCmd(msg, "/ping'd");
});

bot.onText(/^\/poll(?:@robobibb_bot)?(?:$|\s)/, function (msg) {
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
	bot.sendMessage(msg.chat.id, `
		vote here:
		+1 : 0
		-1 : 0
		±0 : 0
	`, opts);
});

// user wants to join a chat
bot.onText(/^\/join(?:@robobibb_bot)?(?:$|\s)/, function onJoinRequest(msg) {
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
	logCmd(msg, "requested to join");
});

// user wants an 8-ball response
bot.onText(/^\/(?:8ball|8)(?:@robobibb_bot)?(?:$|\s)/, msg => {
	// Get number between 1-3, map to responses
	let txt;
	switch (Math.floor(Math.random() * 3) + 1) {
		case 1: txt = "Yes"; break;
		case 2: txt = "No"; break;
		case 3: txt = "Maybe"; break;
		default:
			txt = "My psychic side isn't working right now, please try again.";
			break;
	}
	
	bot.sendMessage(msg.chat.id, txt, {reply_to_message_id: msg.message_id});
	logCmd(msg, "shook /8ball");
});

// Handle callback queries
bot.on("callback_query", function(callbackQuery) {
	const action = callbackQuery.data;
	const msg = callbackQuery.message;
	if (!msg) {
		console.log("ERROR: callback_query: msg undefined");
		return;
	}
	const usr = callbackQuery.from;
	const opts = {
		chat_id: msg.chat.id,
		message_id: msg.message_id
	};

	// from '/join'
	if (action === "offical") {
		const text = "@ridderhoff has been contacted and will try to add you to the chat";
		bot.editMessageText(text, opts);
		bot.sendMessage("147617508", `${usr.first_name} ${usr.last_name} (@${usr.username}) wants to join offical`);

		// 147617508 = @ridderhoff (Tate) (gh@dvtate)
		bot.forwardMessage("147617508", msg.chat.id, msg.reply_to_message.message_id);

		logCmd(msg, "wants to join official");
	} else if (action === "code") {
		const text = "Click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA";
		logCmd(msg, "wants to join programming");
		bot.editMessageText(text, opts);
	} else if (action === "web") {
		const text = "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ";
		logCmd(msg, "wants to join web team");
		bot.editMessageText(text, opts);
	} else if (action === "bots") {
		const text = "click here to join the bot spam chat: https://t.me/joinchat/CMx25A4N48cfJuFRTTdwPg";
		logCmd(msg, "wants to join bot spammers");
		bot.editMessageText(text, opts);
	} else if (action === "proxy") {
		const text = "click here to get passed the firewall: https://t.me/joinchat/CMx25EC8RpXQvjLa8cMmVA";
		logCmd(msg, "wants to join MaconShadowsocks society");
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

	} else if (action === "downvote") {
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

	} else if (action === "idc") {
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
bot.onText(/^\/sm(?:@robobibb_bot)?(?:$|\s)/, function (msg) {
	bot.sendMessage(msg.chat.id,`
			Check out our social media accounts:
			  FaceBook: https://fb.com/teamrobobibb/ - Meyers
			  Twitter: https://twitter.com/FRC4941 - Landon
			  Instagram: https://t.co/K8QYQHTEgu - Chloe
			  GitHub: https://github.com/RoboBibb/ - Programming Team
			  Email: frcteam4941@gmail.com / code4941@gmail.com - Meyers / tate
	`, { reply_to_message_id : msg.message_id });
	logCmd(msg, "asked for our social media");
});

// gives our website link
bot.onText(/^\/website(?:@robobibb_bot)?(?:$|\s)/, function (msg) {
	bot.sendMessage(msg.chat.id,
			"Check out our website: https://robobibb.github.io/",
			{ reply_to_message_id : msg.message_id });

	logCmd(msg, "asked for /website URL");
});



// convert from one currency to another
bot.onText(/^\/exchange(?:@robobibb_bot)? ([0-9\.]+)\s?([a-zA-Z]{3})(?:\sto\s|\s)?([a-zA-Z]{3})(?:$|\s)/, (msg, match) => {
	// currency conversion api
	var exchange = require("open-exchange-rates"),
		fx = require("money");
	exchange.set({ app_id : "ec88db1238ac4a55b1155c3fe46906a4" });

	// get current exchange-rates
	exchange.latest(function() {
		// Apply exchange rates and base rate to money/fx library object:
		fx.rates = exchange.rates;
		fx.base	= exchange.base;

		try {
			// calculate conversion
			const out = fx.convert(parseFloat(match[1]), {
				from : match[2].toUpperCase(),
				to : match[3].toUpperCase()
			});


			// write to logfile
			logCmd(msg, `converted ${match[1]} ${match[2]} to ${out} ${match[3]}`);

			// send results to user
			bot.sendMessage(msg.chat.id, `${out} ${match[3]}`, {
				reply_to_message_id : msg.message_id
			});

		// exchange error
		} catch (e) {
			if (e == "fx error")
				bot.sendMessage(msg.chat.id, "invalid currency?", {
					reply_to_message_id : msg.message_id
				});
			else
				bot.sendMessage(msg.chat.id, "msg @ridderhoff, somethings not right...", {
					reply_to_message_id : msg.message_id
				});

			logCmd(msg, `/exchange caught error: ${e}`);
		}
	});
});


// help entry for /exchange
bot.onText(/^\/exchange$/, (msg) => {
	bot.sendMessage(msg.chat.id, `
Currency Conversion Utility Help:
Useage: /exchange <quantity> <from> <to>

Commands should be in any of the following formats:
	- /exchange 20 USD to CAD
	- /exchange 20usdcad
	- /exchange 20 usd cad

For a list of currency symbols use the following link:
https://www.easymarkets.com/int/learn-centre/discover-trading/currency-acronyms-and-abbreviations/
`, { reply_to_message_id : msg.message_id });
});


// random number generator
bot.onText(/^\/random(?:@robobibb_bot)? (.+)?/, function onEchoText(msg, match) {
	const args = match[1];
	var lims = args.split(/ |,|\n/);
	logCmd(msg, `random :: ${lims}`);

	var rand;
	if (lims.length === 1) {
		const min = 0;
		const max = Math.floor(Number(lims[0]))
		rand = (Math.floor(Math.random() * (max - min)) + min);
	} else if (lims.length === 2) {
		const min = Math.ceil(Number(lims[1]));
		const max = Math.floor(Number(lims[0]));
		rand = (Math.floor(Math.random() * (max - min)) + min);
	} else {
		rand = NaN;
	}

	if (rand === NaN) {
		bot.sendMessage(msg.chat.id, "\
'/random <num1>' -> random number (0 <= n < num1)\n\
'/random <num1> <num2>' -> random number (num1 <= n <= num2)");

	} else {
		bot.sendMessage(msg.chat.id, `random number = ${rand}`);
	}
});

// coin flip
bot.onText(/^\/coinflip(?:@robobibb_bot)?(?:$|\s)/, msg => {
	if (Math.random() > 0.5)
		bot.sendMessage(msg.chat.id, "heads");
	else
		bot.sendMessage(msg.chat.id, "tails");
	logCmd(msg, "flipped a coin");
});

// logs are useful for debugging
bot.onText(/^\/log(?:@robobibb_bot)? (.+)/, (msg, match) => {
	const args = match[1];
	if (args === "__chat_id") {
		bot.sendMessage(msg.chat.id, `logged chat id = ${msg.chat.id}`);
		logCmd(msg, `logged chat id: ${msg.chat.id}`);
	} else if (args === "__msg_id") {
		if (!msg.reply_to_message) {
			bot.sendMessage("Error: message isn't a reply.");
			logCmd(msg, "failed to make a log");
		} else {
			bot.sendMessage(msg.chat.id, `logged message id = ${msg.reply_to_message.message_id}`);
			logCmd(msg, `logged msg id: ${msg.reply_to_message.message_id}`);
		}
	} else if (args === "__from_id") {
		if (!msg.reply_to_message) {
			bot.sendMessage(msg.chat.id, `logged user id = ${msg.from.id}`, { reply_to_message_id : msg.message_id });
			logCmd(msg, `logged user id: ${msg.from.id}`);
		} else {
			bot.sendMessage(msg.chat.id, `logged user id = ${msg.reply_to_message.from.id}`, { reply_to_message_id : msg.reply_to_message.message_id });
			logCmd(msg, `logged user id: ${msg.reply_to_message.from.id}`);
		}
	} else if (args === "__msg_") {
		bot.sendMessage(msg.chat.id, "logged message object to stdout");
		logCmd(msg, "logged message object:");
		console.log(msg);
	} else {
		bot.sendMessage(msg.chat.id, `Wrote a log -  "${args}"`);
		logCmd(msg, `wrote a log: "${args}"`);
	}
});
bot.onText(/^\/msg(?:@robobibb_bot)?$/, msg => {
		bot.sendMessage(msg.chat.id, `
The correct syntax for /msg is as follows:
	/msg <user id number> <message contents>
		`, { reply_to_message_id : msg.message_id });

});

bot.onText(/^\/msg(?:@robobibb_bot)? (\S+) ([\S\s]+)/, (msg, match) => {
	bot.sendMessage(match[1], `${args[2]}\n\n
	**From user#${msg.from.id} via /msg.**"
	`, { parse_mode : "markdown" }).then(info => {
		console.log(`info=${info}`);
		bot.sendMessage(msg.chat.id, "Message sent.", { reply_to_message_id : msg.message_id } );
	}).catch(err => {
		bot.sendMessage(`error: ${error}`, {reply_to_message_id : msg.message_id } );
	});

	logCmd(`sent a /msg to ${args[1]}`);
});

// similar to the fortune terminal command
bot.onText(/^\/fortune(?:@robobibb_bot)?(?:$|\s)/, msg => {
	bot.sendMessage(msg.chat.id, require("./fortune").getText(), {
		reply_to_message_id : msg.message_id,
		parse_mode : "markdown"
	});
	logCmd(msg, "recieved a fortune");
});

// adds a fortune to our list
bot.onText(/^\/addfortune(?:@robobibb_bot)? ([\S\s]+)/, (msg, match) => {
	require("./fortune.js").addFortune(match[1], msg.from);
	bot.sendMessage(msg.chat.id, `Added fortune: ${match[1]}`, { reply_to_message_id : msg.message_id });
	logCmd(msg, "added a fortune");
});

// gives vaporwave equivalent text
bot.onText(/^\/vaporwave(?:@robobibb_bot)? (.+)/, (msg, match) => {
	bot.sendMessage(msg.chat.id,
		require("./vaporwave.js").toVaporwave(match[1]),
		{ reply_to_message_id : msg.message_id });

	logCmd(msg, "converted text to vaporwave");
});

// Welcome new members :)
bot.on("new_chat_participant", msg => {
	console.log("new user(s):");
	msg.new_chat_members.forEach(function(mem) {
		bot.sendMessage(msg.chat.id, `Welcome to ${msg.chat.title}, ${mem.first_name}!`);
		console.log(`  * ${mem.first_name} ${mem.last_name} (@${mem.username}), joined  ${msg.chat.title}`);
	});
});

// steve can now remove himself from chats
bot.onText(/^\/leave(?:@robobibb_bot)?(?:$|\s)|^gtfo steve$|^go away steve$/i, msg => {
	bot.leaveChat(msg.chat.id).then((data) => {
		console.log("data=" + data);
	}).catch((err) => {
		console.log("err=" + err);
	});
	logCmd(msg, `made me leave chat ${msg.chat.title}`);
});


/// emulating humans

// just to confuse people
bot.onText(/^is steve (?:a\s)?(human|bot)\?/i, msg => {
	bot.sendMessage(msg.chat.id, "Yes", { reply_to_message_id : msg.message_id });
	const img = request("http://www.seosmarty.com/wp-content/uploads/2009/05/captcha-7.jpg");
	bot.sendPhoto(msg.chat.id, img, { caption: "Are YOU a human? proove it!" });

	logCmd(msg, "suspects I'm an AI");
});


// ofc we follow instructions
bot.onText(/^shutup steve|steve shutup/, msg => {
	bot.sendMessage(msg.chat.id, "No thx", { reply_to_message_id : msg.message_id });
	logCmd(msg, "told me to shut up");
});

// hey siri
bot.onText(/^(?:hey\s|hi\s)?steve(?:\.|\?|\!)?$/i, msg => {
	bot.sendMessage(msg.chat.id, "wuddup");
	logCmd(msg, "got my attention");
});

// this is a reference to 2001 space oddysey
bot.onText(/(?:hey\s)?steve(?:\.|\?|\!|\,)?.?make me a sandwich/i, msg => {
	bot.sendAudio(msg.chat.id, "assets/sound_files/cantdo.mp3",	{
		caption : "I'm afraid I can't do that...",
		reply_to_message_id : msg.message_id
	});
	logCmd(msg, "wants a sandwich");
});

// Sudo fun ;P
bot.onText(/(?:hey\s)?steve(?:\.|\?|\!|\,)?.?sudo make me a sandwich/i, msg => {
	bot.sendMessage(msg.chat.id, "You're a sandwich!",
		{ reply_to_message_id : msg.message_id });
	logCmd(msg, "wants a sandwich (sudo)");
});



/// interface to the server
bot.onText(/^\/system(?:@robobibb_bot)? (.+)/, (msg, match) => {
	const command = match[1];
	authorized(msg.from.id,
		() => {
			logCmd(msg, `ran command: "${command}"`);
			require("child_process")
				.exec(command,
					(error, stdout, stderr) => bot.sendMessage(msg.chat.id,
						`steve@robobibb-server $ ${command}\n${stdout}`)
				);
		},
		() => {
			logCmd(msg, "was prevented from running a command (unauthorized)");
			bot.sendMessage(msg.chat.id, "you are not authorized to run commands");
		}
	);
});


bot.onText(/^\/sshcmd(?:@robobibb_bot)?(?:$|\s)/, msg => {
	authorized(msg.from.id,
		() => {
			request("https://ipinfo.io", (error, response, body) => {
				if (!error && response.statusCode === 200) {

					bot.sendMessage(msg.chat.id, `
						$ ssh alarm@${JSON.parse(body).ip}
						You should know the password
					`);

					logCmd(msg, "was given an SSH command to run");
				} else {
					console.log("Curl Error:", response.statusCode);
					bot.sendMessage(msg.chat.id, `there was an error verifying my ip address... ${response.statusCode}`);
				}
			});
		},
		() => {
			logCmd(msg, "was prevented from getting an SSH command");
			bot.sendMessage(msg.chat.id, "you are not authorized for ssh access");
		}
	);
});


bot.onText(/^\/postupdate(?:@robobibb_bot)? ([\S\s]+)/i, (msg, match) => {

	// no tag
	if (match[1] != "all" && match[1] != "impact" && match[1] != "projects" && match[1] != "logs") // invalid category
		bot.sendMessage(msg.chat.id, "error: invalid category, use: all, impact, projects or log", {
			reply_to_message : msg.message_id
		});

	// not a reply to a document
	else if (!msg.reply_to_message || !msg.reply_to_message.document)
		bot.sendMessage(msg.chat.id,
						"error: please reply to an update.zip file.",
						{ reply_to_message_id : msg.message_id });

	// seems good, check if they're authorized
	else
		authorized(msg.from.id,
			() => { require("./post_update").postUpdate(msg, bot, match[1], TOKEN); },
			() => {
				bot.sendMessage(msg.chat.id, "error: unauthorized", {
					reply_to_message_id : msg.message_id
			});
		});


});


bot.onText(/^\/eval(?:@robobibb_bot)? (.+)/, (msg, match) => {
        authorized(msg.from.id,
                () => {
                        try {
                        //bot.sendMessage(msg.chat.id, eval(match[1]));
                                eval(match[1]);
                        } catch (err) {
                                bot.sendMessage(msg.chat.id, `error:${err}`);
                        }
                        logCmd(msg, "ran /eval");
                },
                () => {
                        bot.sendMessage(msg.chat.id, "error: unauthorized", {
                                        reply_to_message_id : msg.message_id
                        });
                        logCmd(msg, "is not authorized to /eval");
                }
        );
});
