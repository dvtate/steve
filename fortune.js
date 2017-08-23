/// Contains all the fortunes that one could recieve... 
/// this file will grow with time

module.exports.getText = function() {
	const fortunes = [
		"So tell me, where I should go?\nto the left where nothing is right...\nor to the right where nothing is left...",
		"Look at you, hacker, a pathetic creature of meat and bone. How can you challenge a perfect immortal machine?",
		"How beautiful it is to do nothing and then rest afterward.",
		"With my luck, I'll probably be reincarnated as me.",
		"Think before sharing with others.",
		"More good code has been written in languages denounced as \"bad\" than in languages proclaimed \"wonderful\" -- much more.\n-- Bjarne Stroustrup"
	];

	return fortunes[Math.floor(Math.random() * fortunes.length)];
}
