var moment = require('moment');
var commands = require('./commandManager');
var orari = require('../orari-roma3');
var dipartimenti = require('../dipartimenti');

var handleError = function (err, msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Si è verificato un errore, verrà risolto al più presto");
    console.log(err);
};

commands.on('/start', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Che vuoi?');
});

commands.on('/help', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Eccoti qualche comando "sicuramente" funzionante:\n' +
        '\n/aulelibere - Mostra le aule libere adesso' +
        '\n/help - C\'è bisogno di spiegazioni?');
});

commands.on('/aulelibere', function (msg, telegramBot) {
    orari.getAuleLibere(dipartimenti.INGEGNERIA).then(function (aule) {
        var message = 'Eccoti una lista delle aule libere (sperando non siano chiuse):';
        aule.forEach(function (item) {
            message += '\n - ' + item.aula;
            if (item.date.getDate() == new Date().getDate())
                message += ' fino alle ' + moment(item.date).format('HH:mm');
        });
        telegramBot.sendMessage(msg.chat.id, message);
    }).catch(function (err) {
        handleError(err, msg, telegramBot);
    });
});

commands.on('/default', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Non ho capito!');
});