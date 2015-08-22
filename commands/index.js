var moment = require('moment');
var commands = require('../modules/command-manager');
var orari = require('../modules/orari-roma3');
var dipartimenti = require('../modules/dipartimenti');

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

commands.on('/lezioni', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi dispiace, ma gli scansafatiche del LUG Roma 3 ancora non mi hanno' +
        ' insegnato come scrivere le lezioni odierne!');
});

commands.on('/cometichiami', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi chiamo LUG Roma 3 Bot!');
});

commands.on('/grazie', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Prego!');
});

commands.on('/default', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Non ho capito!');
});