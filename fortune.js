/// Contains all the fortunes that one could recieve... 
/// this file will grow with time

module.exports.getText = function() {
	const fortunes = [
		"So tell me, where I should go?\nto the left where nothing is right...\nor to the right where nothing is left...",
		"Look at you, hacker, a pathetic creature of meat and bone. How can you challenge a perfect immortal machine?",
		"How beautiful it is to do nothing and then rest afterward.",
		"A computer lets you make more mistakes faster than any other invention, with the possible exceptions of handguns and Tequilla.\n-- Mitch Ratcliffe",
		"Think before sharing with others."
	];

	return fortunes[Math.floor(Math.random() * fortunes.length)];
}
