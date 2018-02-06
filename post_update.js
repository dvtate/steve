/// This module is used to post articles to robobibb.github.io/updates




const fs = require("fs");


module.exports.postUpdate = function (msg, bot, category, token) {

	// if its too big a file...
	if (msg.reply_to_message.document.file_size > 50000000) {
		bot.sendMessage(msg.chat.from,
			"error: upload greater than 50mb, try putting videos and other large files on external sites. \
If you still need help feel free to contact @ridderhoff", {
			reply_to_message : msg.message_id
		});
		return;
	}

	bot.getFileLink(msg.reply_to_message.document.file_id).then(fileURL => {

		// ws_setup.sh does the following
		// clone website repo
		// make the directory for the new file
		// make dir.txt to tell us where the directory is
		// unpack update.zip into the directory
		require("child_process").spawnSync("sh", [ "ws_setup.sh", fileURL ], {stdio:"inherit"});


		var dir = fs.readFileSync("dir.txt", "utf8");
		dir = `${dir}`.replace(/\n/, "");

		console.log(`getting post content from ${dir}...`);

		const date = require("node-datetime").create().format("Y-m-d at H:M");
		const author = genAuthor(msg.from);

		try {
			var title = fs.readFileSync(dir + "/title.txt", "utf8");
			var body = fs.readFileSync(dir + "/body.html", "utf8");
			var summary = fs.readFileSync(dir + "/summary.txt", "utf8");
		} catch (e) {

			console.log("error: something missing://///");
			// something missing?
			if (!body)
				bot.sendMessage(msg.chat.id, "error: update.zip lacks body.html");
			if (!title)
				bot.sendMessage(msg.chat.id, "error: update.zip lacks title.txt");
			if (!summary)
				bot.sendMessage(msg.chat.id, "error: update.zip lacks summary.txt");
			throw e;

		}


		if (!fs.existsSync(dir + "/thumb.png")) {
			bot.sendMessage(msg.chat.id, "error: update.zip lacks thumb.png", {
				reply_to_message : msg.message_id
			});
			return;
		}

		console.log("generating update from a template...");
		// write our webpage
		fs.writeFileSync(dir + "/index.html", genArticle(title, summary, author, date, body));

		console.log("adding update to listing...");

		// add webpage to listing
		var data = fs.readFileSync("robobibb.github.io/updates/index.html", "utf8");


		var listing = genListing(dir.match(/\/([0-9]+?)\/?$/)[1], title, summary);


		var result = `${data}`.replace(/id="list_all">/, "id=\"list_all\">\n" + listing);

		if (category != "all")
			if (category == "impact")
				result = result.replace(/id="list_impact">/, "id=\"list_impact\">\n" + listing);
			else if (category == "projects")
				result = result.replace(/id="list_projects">/, "id=\"list_projects\">\n" + listing);
			else if (category == "logs")
				result = result.replace(/id="list_logs">/, "id=\"list_logs\">\n" + listing);

		fs.writeFileSync("robobibb.github.io/updates/index.html", result);


		console.log("finishing up...");
		// remove unneeded files and commit
		require("child_process").spawnSync("sh", [ "ws_cleanup.sh", author ], { stdio: "inherit" });

	}).catch(error => {
		bot.sendMessage(msg.chat.id, "error: failed to create link", {
			reply_to_message : msg.message_id
		});
		console.log(`fuck:\n${error}`);
	});
}


// the source code for the article's page
function genArticle(title, description, author, date, body) {
	return `<!DOCTYPE html>
<html>
	<head>
		<title>${title}</title>
		<meta name="description" content="${description}"/>
		<meta name="keywords" content="FRC robotics FIRST RoboBibb 4941 #4941 team howard high school bibb county robots macon"/>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<link rel="icon" type="image/jpg" href="https://robobibb.github.io/imgs/roboman.jpg" />
		<link rel="stylesheet" href="https://www.w3schools.com/lib/w3.css"/>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato"/>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

		<link rel="stylesheet" href="https://robobibb.github.io/styles/main.css" />
		<link rel="stylesheet" href="https://robobibb.github.io/styles/update-pages.css" />
		<script src="https://robobibb.github.io/scripts/main.js"></script>
	</head>
	<body>
		<!-- Navbar -->
		<div class="w3-top" id="navbarhere"></div>
		<script>genNavBar("navbarhere");</script>

		<!-- Page content -->
		<div class="w3-content" id="pageBackground" style="max-width:2000px">
			<div class="w3-container w3-content w3-center w3-padding-64" id="sheet" style="max-width:800px;border:1px solid grey">

				<!-- Title -->
				<div class="w3-content w3-center">
					<h1>${title}</h1><hr/>
					<h5>Submitted By ${author} on ${date}</h5>
				</div>

				<div class="update-body">
					${body}
				</div>
		<!-- End Page Content -->
			</div>
		</div>


		<!-- Footer -->
		<footer id="dark-footer"></footer>
		<script>genFooter();</script>

	</body>
</html>`;
}

// make the authors name using msg.from
function genAuthor(from) {
	// they are graduated to have a first name
	var ret = from.first_name;

	if (from.last_name)
		ret += " " + from.last_name;
	if (from.username)
		ret += " (@" + from.username + ")";

	return ret;
}


// the html element to add to the list for this article
function genListing(dirnum, title, summary) {
	return `<table><tr>
	<td><a href="https://robobibb.github.io/updates/u/${dirnum}/">
		<img class="update-thumb" src="https://robobibb.github.io/updates/u/${dirnum}/thumb.png"/>
	</a></td><td>
		<a href="https://robobibb.github.io/updates/u/${dirnum}/"><h4 class="update-title">${title}</h4></a>
		<p class="update-desc">${summary}</p>
	</td>
</tr></table></a>
<hr/>`;

}
