var moment = require('moment');
var commands = require('./commandManager');
var orari = require('../orari-roma3');

commands.on('/start', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Che vuoi?');
});

commands.on('/help', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Eccoti qualche comando "sicuramente" funzionante:\n' +
        '\n/aulelibere - Mostra le aule libere adesso' +
        '\n/help - C\'è bisogno di spiegazioni?');
});

commands.on('/aulelibere', function (msg, telegramBot) {
    orari.getAuleLibere(function (err, aule) {
        var message = 'Eccoti una lista delle aule libere (sperando non siano chiuse):';
        aule.forEach(function (item) {
            message += '\n - ' + item.aula + ' fino alle ' + moment(item.date).format('HH:mm');
        });
        telegramBot.sendMessage(msg.chat.id, message);
    });
});

commands.on('/default', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Non ho capito!');
});