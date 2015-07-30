var commands = require('./commandManager');

commands.on('/start', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Che vuoi?');
});

commands.on('/help', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Eccoti qualche comando "sicuramente" funzionante:\n' +
        '\n/aulelibere - Mostra le aule libere adesso' +
        '\n/help - C\'è bisogno di spiegazioni?');
});

commands.on('/aulelibere', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'E che me lo invento?');
});

commands.on('/default', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Non ho capito!');
});