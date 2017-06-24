'use strict';

const TOKEN = process.env.TELEGRAM_TOKEN || 'api key';
const TelegramBot = require("node-telegram-bot-api");
const request = require('request');
const bot = new TelegramBot(TOKEN, { polling: true });


// Matches /photo
bot.onText(/\/cat/, function onPhotoText(msg) {
	// From file path
	const photo = `${__dirname}/../test/data/photo.gif`;
	const url = "http://lorempixel.com/400/200/cats/"
	const img = request(url);
	bot.sendPhoto(msg.chat.id, img, { caption: "look at the kitty!" });
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") likes /cat's");
});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp);
  console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") echo'd");
});


// ping response testing
bot.onText(/\/ping/, function onPing(msg) {
	bot.sendMessage(msg.chat.id, "pong");
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") ping'd");
});


// just to confuse people
bot.onText(/is steve a human?/i, function (msg) {
	bot.sendMessage(msg.chat.id, "Yes", { reply_to_message_id : msg.message_id });
	const img = request("http://www.seosmarty.com/wp-content/uploads/2009/05/captcha-7.jpg");
	bot.sendPhoto(msg.chat.id, img, { caption: "Are YOU a human? proove it!" });
});


// Matches /editable
bot.onText(/\/joinChat/i, function onEditableText(msg) {
	const opts = {
		reply_markup: {
			inline_keyboard: [
				[ { text: "RoboBibb Offical", callback_data: "offical" } ],
				[ { text: "Programming team", callback_data: "code" } ],
				[ { text: "Website team", callback_data: "web" } ]
			]
		}
	};
	bot.sendMessage(msg.chat.id, 'Which chat do you want to join?', opts);
	console.log(msg.from.first_name + " " + msg.from.last_name + " (@" + msg.from.username + ") requested to join");
});



// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
	const action = callbackQuery.data;
	const msg = callbackQuery.message;
	const usr = callbackQuery.from;

	// from '/join 4941'
	if (action === "offical") {
		bot.sendMessage(msg.chat.id, "contact @ridderhoff and he will add you to the offical chat.");
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join offical");
	} else if (action === "code") {
		bot.sendMessage(msg.chat.id, "click here to join the programming chat: https://t.me/joinchat/AAAAAD_IZ5v-FtjYBUT0cA");
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join programming");
	} else if (action === "web") {
		bot.sendMessage(msg.chat.id, "click here to join the website chat: https://t.me/joinchat/AAAAAEDoGWJ1t0xW1tzjzQ");
		console.log(usr.first_name + " " + usr.last_name + " (@" + usr.username + ") wants to join web team");
	}

});
