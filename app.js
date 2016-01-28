'use strict';

var commandManager = require('./modules/command-manager');
var telegramBot = require('./modules/telegram-bot');
var genius = require('./modules/genius');
//var speaker = require('./modules/speaker');

require('./scheduling');
require('./commands');
//commandManager.use(speaker.Middleware);
commandManager.use(genius.Middleware);
commandManager.use(function (msg, telegramBot) {
    commandManager.commands['/default'](msg, telegramBot);
});

telegramBot.attachCommandManager(commandManager);
