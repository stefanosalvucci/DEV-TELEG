'use strict';

var config = require('../../etc/config');
var token = config.telegramToken;
var logger = require('./logger');
var TelegramBot = require('node-telegram-bot-api');

TelegramBot.prototype.attachCommandManager = function (commandManager) {
  this.on('message', function (msg) {
    logger.log(msg.chat.id, msg.text, false); // Log message
    //logger.sniff(msg);
    logger.sniffInfoGruppo(msg);
    logger.sniffInfoPrivato(msg); 
    logger.sniffInsulted(msg);
    commandManager.handleMessage(msg, telegramBot)
  });
  this.on('error', function eventEmitterCallback(err) {
    console.error(err.stack);
  });
};

TelegramBot.prototype.sendMessage = (function (superSendMessage) {
  return function (chatId, message, options) {
    logger.log(chatId, message, true);
    superSendMessage.call(this, chatId, message, options);
  }
})(TelegramBot.prototype.sendMessage); // Log message

TelegramBot.prototype.sendSticker = (function (superSendSticker) {
  return function (chatId, sticker, options) {
    logger.log(chatId, sticker, true);
    superSendSticker.call(this, chatId, sticker, options);
  }
})(TelegramBot.prototype.sendSticker); // Log message

var telegramBot = new TelegramBot(token, {
  webHook: config['webHook'],
  polling: config['polling']
});

if (config.webHook) {
  telegramBot.setWebHook(config.webHook.url || 'https://' + config.webHook.domain + ':' + config.webHook.port + '/bot' + config.telegramToken, config.webHook.cert);
} else {
  telegramBot.setWebHook('');
}

module.exports = telegramBot;