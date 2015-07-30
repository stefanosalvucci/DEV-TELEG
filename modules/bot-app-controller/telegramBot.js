var config = require('../../config.json');
var token = config["TelegramToken"];

var TelegramBot = require('node-telegram-bot-api');

TelegramBot.prototype.attachCommandManager = function (commandManager) {
    this.on('message', function (msg) {
        commandManager.handleMessage(msg, telegramBot)
    });
};

var telegramBot = new TelegramBot(token, {polling: true});
module.exports = telegramBot;