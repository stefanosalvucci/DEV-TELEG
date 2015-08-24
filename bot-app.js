var commandManager = require('./modules/command-manager');
var telegramBot = require('./modules/telegram-bot');
var genius = require('./modules/genius');
var userManager = require('./modules/user-manager');

require('./commands');
commandManager.use(userManager.Middleware);
commandManager.use(genius.Middleware);
commandManager.use(function (msg, telegramBot) {
    commandManager.commands['/default'](msg, telegramBot);
});

telegramBot.attachCommandManager(commandManager);
