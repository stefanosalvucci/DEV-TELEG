'use strict';

var moment = require('moment');
var commands = require('../modules/command-manager');
var orari = require('../modules/orari-roma3');
var dipartimenti = require('../modules/dipartimenti');
var User = require('../modules/user-manager').User;
var errors = require('../lib/errors');
var db = require('../modules/database').db;



var handleError = function (err, msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Si è verificato un errore, verrà risolto al più presto");
    console.error(err.stack);
};

var listaComandi = '/insulted - Insulta i tuoi amici!' +
    '\n/spotted - Apprezza qualcuno, potresti essere ricambiato!' +
    '\n/claim - Ottieni un indizio, e scopri chi ti ha pensato!' +    
    '\n/dimenticami - Elimina le tue informazioni personali' +
    '\n/help - Mostra la lista dei comandi disponibili';

/* accept variables */
var accept = '/accetta - Accetta le condizioni di utilizzo del Bot Insulted Roma Tre \n';
var isAccepted = false; //verifica se hai accettato i termini
var CHAT_GROUP_ID = -69948627; 

/* comandi start e accetta: start non può essere ripetuto, NOTA: metti in ogni metodo il controllo su isAccepted */
function start_action(msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Benvenuto! Questo bot ti permette di insultare o spottare una persona in anonimato! Le tue informazioni non verranno trasmesse ad anima viva! Accetta i termini e buon divertimento! " +
        '\n' + accept);  
}

commands.on('/start', function (msg, telegramBot) {
    !isAccepted && start_action(msg,telegramBot);
});

commands.on('/accetta', function (msg, telegramBot) {
    if (isAccepted) {
        telegramBot.sendMessage(msg.chat.id, "Hai già accettato! Ecco la lista delle cose che puoi chiedermi:\n\n" + listaComandi);
    }
    else { 
        telegramBot.sendMessage(msg.chat.id, 'Grazie per aver accettato! Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
        isAccepted = true;
    }
});

commands.on('/help', function (msg, telegramBot) {
    if (isAccepted) {
        telegramBot.sendMessage(msg.chat.id, 'Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
    }
    else { 
        start_action(msg, telegramBot);
    }
});


commands.on('/insulted', function (msg, telegramBot) {
    var lastMessage = db.collection("sniff").find().sort({message_id:-1}).limit(1);
    console.log(db.collection("sniff"));
    /*
    var text_message = "Insulto #" + msg.from.id + msg.text;
    telegramBot.sendMessage(CHAT_GROUP_ID, msg.text); */

    /*if (isAccepted) {
        telegramBot.sendMessage(msg.chat.id, "Hai già accettato! Ecco la lista delle cose che puoi chiedermi:\n\n" + listaComandi);
    }
    else { 
        telegramBot.sendMessage(msg.chat.id, 'Grazie per aver accettato! Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
        isAccepted = true;
    } */
});

/*
commands.on('/aulelibere', function (msg, telegramBot) {
    var hideKeyboardOpts = {reply_markup: JSON.stringify({hide_keyboard: true})};
    var user = new User(msg.from.id, telegramBot);
    user.getDipartimento().then(function (dipartimentoId) {
        return orari.getAuleLibere(dipartimenti[dipartimentoId]);
    }).then(function (aule) {
        var message = '';
        if (aule.length == 0)
            return message = 'Scusa ma non sono riuscito a trovare aule libere nel tuo dipartimento.\n' +
                'Potrebbero non esserci aule libere in questo momento, oppure un problema sui server di Ateneo';

        message = 'Eccoti una lista delle aule libere (sperando non siano chiuse!):';
        aule.forEach(function (item) {
            message += '\n - ' + item.aula; 
            if (item.date.getDate() == new Date().getDate())
                message += ' fino alle ' + moment(item.date).format('HH:mm');
            else
                message += ' fino alla chiusura';
        });
        return message;
    }).then(function (message) {
        telegramBot.sendMessage(msg.chat.id, message, hideKeyboardOpts);
    }).catch(function (err) {
        if (err instanceof errors.InputValidationError)
            telegramBot.sendMessage(msg.chat.id, err.message, hideKeyboardOpts);
        else
            handleError(err, msg, telegramBot);
    });
});
*/
/*
commands.on('/lezioni', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi dispiace, ma gli scansafatiche del LUG Roma Tre ancora non mi hanno' +
        ' insegnato come scrivere le lezioni odierne!');
});
*/

commands.on('/dimenticami', function (msg, telegramBot) {
    var user = new User(msg.from.id, telegramBot);
    user.forget().then(function () {
        telegramBot.sendMessage(msg.chat.id, 'Ooh che mal di testa... Non mi ricordo più chi sei!')
    }).catch(function (err) {
        handleError(err, msg, telegramBot);
    });
});

commands.on('/cometichiami', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi chiamo Spotted/Insulted Roma Tre Bot!');
});

commands.on('/grazie', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Prego!');
});

// TODO Access this command only in debug mode
//commands.on('/debug', function (msg, telegramBot) {
//});

commands.on('/default', function (msg, telegramBot) {    
    if (msg.chat.id !==  CHAT_GROUP_ID) {
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
                message = 'Ma tu non hai voglia di spottare qualcuno?';
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
    }
});