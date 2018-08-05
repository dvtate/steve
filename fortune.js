/// This module gets all the fortunes from assets/fortunes.txt

const fs = require("fs");

// reads the list of fortunes from the file
module.exports.updateFortunesList = function(){
        module.exports.fortunes = require("fs").readFileSync("./assets/fortunes.txt")
        	.toString().split(/<quote>/).map(quote => quote.trim());
        return module.exports.fortunes;
}

// get the list of fortunes
module.exports.fortunes = module.exports.updateFortunesList();

// pick a random fortune
module.exports.getText = function() {
        return module.exports.fortunes[
        	Math.floor(Math.random() * module.exports.fortunes.length)
        ];
}

// add a fortune to the file
module.exports.addFortune = function (quote, from) {
	// add quote to fortune file
	require("fs").appendFile("./assets/fortunes.txt", "<quote>\n" + quote, function (err) {
		if (err) throw err;
		console.log("Added a fortune!");
		module.exports.updateFortunesList();


		console.log("sys ./push_fortunes.sh \"fortune from " + from.first_name + "\"");

		// commit new fortunes
		require("child_process").spawnSync("sh",
			[ "push_fortunes.sh", "fortune from " + from.first_name ],
			{ stdio: [ fs.openSync(`${process.env.HOME}/.steve/gh_key`, 'r'), 0, 0] });

	});
}
