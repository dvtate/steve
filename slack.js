"use strict";

// imports
const util = require('util');
const request = require("request");
const { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } = require('@slack/client');


// authentication token
const token = process.env.SLACK_KEY;
//const webhookURL = ;

// TG binding
var tg_bot;
const tg_chatid = "-1001065686661"; // main

// Cache of data
const appData = {};

// see slack rtm api
const rtm = new RtmClient(token, {
    dataStore: false,
    useRtmConnect: true,
});

// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

// Load the current channels list asynchrously
let usersList = web.users.list();
let channelListPromise = web.channels.list();




// on incoming msg
rtm.on(RTM_EVENTS.MESSAGE, message => {

    // Skip messages that are from a bot or my own user ID
    if ( (message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === appData.selfId) )
    {
        console.log("botmsg..");
    }

    // msg has text property
    if (message.text) {
        // check connection
        if (message.text.match(/^.ping/))
            web.chat.postMessage(message.channel, "pong");

        // flip a coin
        else if (message.text.match(/^.coinflip/))
            web.chat.postMessage(message.channel, Math.random() > 0.5 ? "heads" : "tails");

        else if (message.text.match(/^.xkcd$/)) {
            request("https://c.xkcd.com/random/comic/", (error, response, body) => {
        		if (error) {
        			console.log(`.xkcd - error: ${error}`);
        			console.log(`    statusCode: ${response && response.statusCode}`);
        			web.chat.postMessage(message.channel, "xkcd might be down atm :/")
        			return;
        		}

        		const imgurl = body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1];
                const caption = body.match(/<div id="ctitle">(.+?)<\/div>/)[1];
                web.chat.postMessage(message.channel, `${caption}\nhttps:${imgurl}`)

        	});
        }
    }

    // Logging
    web.channels.info(message.channel).then((chan_info) => {
        if (chan_info.channel.name == "general")
        web.users.info(message.user).then((usr_info) => {
            if (message.subtype == "message_changed") // edit
                tg_bot.sendMessage(tc_chatid, `${usr_info.user.profile.real_name} in #${chan_info.channel.name}: edited '${message.previous_message.text}' to '${message.message.text}'`);
            else if (message.text) // generic msg
                tg_bot.sendMessage(tg_chatid, `${usr_info.user.profile.real_name} in #${chan_info.channel.name}: ${message.text}`);
        });
    });




});

// Start the connecting process
rtm.start();

// import bot bindings
module.exports.setBot = bot => { tg_bot = bot; }
