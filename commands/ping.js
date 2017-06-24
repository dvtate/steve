// this handles the /ping command



const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController


class PingController extends TelegramBaseController {
    pingHandler($) {
    	console.log('recieved command: ping');
        $.sendMessage('pong\ntext = \"' + $._update._message._text + '\"');

    }

    get routes() {
        return {
            '/ping': 'pingHandler'
        }
    }
}

module.exports = {
	controller : PingController,
	command	: "/ping"
};
