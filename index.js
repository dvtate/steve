'use strict';

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const tg = new Telegram.Telegram('api key');


function loadCommands() {
	const dir = './commands/';
	const fs = require('fs');

	fs.readdir(dir, (err, files) => {
		files.forEach(file => {
			const cmd = require(dir + file);
			tg.router.when(
				new TextCommand(cmd.command, cmd.command),
				new cmd.controller()
			);
		});
	});
}

loadCommands();
