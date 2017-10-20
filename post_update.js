module.exports.MakeUpdate = function (msg, category, token) {


	if (msg.reply_to_message.document.file_size > 50000000)
		bot.sendMessage(msg.chat.from,
			"error: upload greater than 50mb, try putting videos and other large files on external sites. \
If you need help feel free to contact @ridderhoff", {
			reply_to_message : msg.message_id
		});



	const download = require("download");

	bot.getFileLink(msg.reply_to_message.document.file_id).then(fileURL => {
		console.log(fileURL);
		download(fileURL).then(data => {
	    		fs.writeFileSync(file, data);


		}).catch(error => {
			bot.sendMessage(msg.chat.id, "error: file not found", {
				reply_to_message : msg.message_id
			});
		});

	}).catch(error => {
		bot.sendMessage(msg.chat.id, "error: failed to create link", {
			reply_to_message : msg.message_id
		});
	});
}
