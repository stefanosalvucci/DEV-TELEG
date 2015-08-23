var config = require('../../config.json');
var token = config["telegramToken"];
var logger = require('./logger');
var TelegramBot = require('node-telegram-bot-api');

TelegramBot.prototype.attachCommandManager = function (commandManager) {
    this.on('message', function (msg) {
        logger.log(msg.chat.id, msg.text, false); // Log message
        commandManager.handleMessage(msg, telegramBot)
    });
};

TelegramBot.prototype.sendMessage = (function (superSendMessage) {
    return function (chatId, message) {
        logger.log(chatId, message, true);
        superSendMessage.call(this, chatId, message);
    }
})(TelegramBot.prototype.sendMessage); // Log message

var telegramBot = new TelegramBot(token, {polling: true});
module.exports = telegramBot;