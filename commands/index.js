var moment = require('moment');
var commands = require('../modules/command-manager');
var orari = require('../modules/orari-roma3');
var dipartimenti = require('../modules/dipartimenti');
var User = require('../modules/user-manager').User;

var handleError = function (err, msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Si è verificato un errore, verrà risolto al più presto");
    console.error(err.stack);
};

var listaComandi = '/aulelibere - Mostra le aule libere adesso' +
    '\n/help - Mostra la lista dei comandi disponibili';

commands.on('/start', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Ciao! Di cosa hai bisogno?' +
        '\n' + listaComandi);
});

commands.on('/help', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Ecco la lista delle cose che puoi chiedermi:\n' +
        '\n' + listaComandi);
});

commands.on('/aulelibere', function (msg, telegramBot) {
    var user = new User(msg.from.id, telegramBot);
    user.getDipartimento().then(function (dipartimentoId) {
        return orari.getAuleLibere(dipartimenti[dipartimentoId]);
    }).then(function (aule) {
        var message = 'Eccoti una lista delle aule libere (sperando non siano chiuse!):';
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
    telegramBot.sendMessage(msg.chat.id, 'Mi dispiace, ma gli scansafatiche del LUG Roma Tre ancora non mi hanno' +
        ' insegnato come scrivere le lezioni odierne!');
});

commands.on('/cometichiami', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi chiamo Info Roma Tre Bot!');
});

commands.on('/grazie', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Prego!');
});

// TODO Access this command only in debug mode
//commands.on('/debug', function (msg, telegramBot) {
//    console.log(msg);
//    var user = new User(msg.from.id);
//    user.getDipartimento();
//});

commands.on('/default', function (msg, telegramBot) {
    var message = '';
    var rand = Math.floor(Math.random() * 5);
    switch (rand) {
        case 0:
            message = 'Mi dispiace ma non ho capito!';
            break;
        case 1:
            message = 'Hey, non sono mica così intelligente!';
            break;
        case 2:
            message = 'Ma tu non hai fame?';
            break;
        case 3:
            message = "\"Software is like sex: it's better when it's free.\" - Linus Torvalds";
            break;
        case 4:
            message = "Scusami... Ma non so proprio cosa dirti!";
            break;
    }
    message += '\n\nDigita /help per la lista dei comandi disponibili!';
    telegramBot.sendMessage(msg.chat.id, message);
});