var commandManager = require('./modules/command-manager');
var telegramBot = require('./modules/telegramBot');
var genius = require('./modules/genius');

require('./commands');
commandManager.use(genius.Middleware);
telegramBot.attachCommandManager(commandManager);
