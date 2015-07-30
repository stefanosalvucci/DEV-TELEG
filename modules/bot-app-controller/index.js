var commandManager = require('../command-manager');
var telegramBot = require('./telegramBot');

telegramBot.attachCommandManager(commandManager);