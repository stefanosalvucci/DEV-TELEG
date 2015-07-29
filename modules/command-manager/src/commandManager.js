
var Telegram = require('../../node-telegram-bot-api');
var config = require('../config.json');
var commands = require('../commands.json');
var token = config["token"];

var TelegramBot = new Telegram(token, {polling:true});

TelegramBot.on('message', function commandHandler(msg){
    var id = msg.chat.id;
    if(!commands[msg.text]){
        TelegramBot.sendMessage(id,commands["/default"]);
    }
    else {
        TelegramBot.sendMessage(id,commands[msg.text]);
    }
});
