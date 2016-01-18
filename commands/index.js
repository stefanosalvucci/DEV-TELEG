const CHAT_GROUP_ID = -69948627;

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

var listaComandi = '/insult - Insulta i tuoi amici!' +
    '\n/spot - Apprezza qualcuno, potresti essere ricambiato!' +
    '\n/claim - Ottieni un indizio, e scopri chi ti ha pensato!' +
    '\n/exit - Elimina le tue informazioni personali' +
    '\n/help - Mostra la lista dei comandi disponibili';

/* Controlla se l'utente ha accettato le condizioni */
function hasAccepted(userId){
    var user = new User(userId);
    user.getUser().then(function(user){
        return user.hasAccepted;
    });
};

/* Se l'utente ha accettato le condizioni, setta il parametro 'hasAccepted' a true */
function setAccepted(userId){
    var user = new User(userId);
    user.getUser().then(function(){
        user.update({hasAccepted: true});
    });
};

/* comandi start e accetta: start non può essere ripetuto, NOTA: metti in ogni metodo il controllo su isAccepted */
function start_action(msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Benvenuto! Questo bot ti permette di insultare o spottare una persona in anonimato! Le tue informazioni non verranno trasmesse ad anima viva! Accetta i termini e buon divertimento!\n /accept - Accetta le condizioni di utilizzo del Bot Insulted Roma Tre");
};

commands.on('/start', function (msg, telegramBot) {
    var user = new User(msg.chat.id, telegramBot, msg.from.first_name, msg.from.last_name, msg.from.username);
    var promise = user.getUser();
    if(promise != user) {
        //console.log(promise);
        console.log(user);
        user.addToDb();
    }    
    start_action(msg,telegramBot);
});

commands.on('/accept', function (msg, telegramBot) {
  if (hasAccepted(msg.chat.id)) {
    telegramBot.sendMessage(msg.chat.id, "Hai già accettato! Ecco la lista delle cose che puoi chiedermi:\n\n" + listaComandi);
  }
  else {
    telegramBot.sendMessage(msg.chat.id, 'Grazie per aver accettato! Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
    setAccepted(msg.chat.id);
  }
});

commands.on('/help', function (msg, telegramBot) {
    if (hasAccepted(msg.chat.id)) {
        telegramBot.sendMessage(msg.chat.id, 'Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
    }
    else {
        start_action(msg, telegramBot);
    }
});


commands.on('/spot', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, text_message);
});

commands.on('/insult', function (msg, telegramBot) {
    // var lastMessage = db.collection("sniff").find().sort({message_id:-1}).limit(1);
    // //console.log(db.collection("sniff"));
    // console.log(msg.message_id);
    var text_message;
    var chat_id = msg.chat.id;
    if(!hasAccepted(msg.chat.id)) {
        text_message = "Mi dispiace ma finchè non accetti i termini non posso ascoltarti, premi /help per saperne di più";
    }

    /* i comandi insulted e spotted possono essere fatti solo nel nostro gruppo ;) */
    if(msg.chat.id!==CHAT_GROUP_ID) {
        if(!msg.text || msg.text.length<10) {
            text_message = "Il comando /insult è costituito da: /insult + messaggio, digita correttamente il comando e scrivi il tuo insulto!";           
        }
        else {
            text_message = "Insulto #" + msg.message_id + "\n" + msg.text;
            telegramBot.sendMessage(chat_id, "L'insulto è stato correttamente inviato nel gruppo!"); 
            chat_id = CHAT_GROUP_ID;
        }
    }
    else {
        text_message = "il comando /insult non può essere usato nella chat di gruppo, scrivimi in privato!";
    }
    telegramBot.sendMessage(chat_id, text_message);
});

commands.on('/claim', function (msg, telegramBot) {
    var text_message;
    var message_id;
    if (msg.text.indexOf("#") === 0){
        msg.text = msg.text.substring(1);
    }
    message_id = Number(msg.text);
    if (msg.chat.id !==  CHAT_GROUP_ID) {
        if (!isNaN(message_id)) {
            text_message = "Per scoprire chi ha scritto il messaggio devi eseguire il comando \n /sendClaim seguito dall'ID e dal numero di cellulare su cui ti invieremo solo alcune lettere del nome della persona che ha scritto il messaggio #"+ message_id + "\n" +
                "ATTENZIONE: non vi sarà alcuna corrispondenza con la lunghezza del nome della persona\n" +
                "Il messaggio è gratuito, nessun costo vi verrà addebitato.\n" +
                "Esempio: \n" +
                "/sendClaim #" + message_id + " 3351234567";
        }else{
            text_message = "Errore! Inserire un ID del messaggio valido!"
        }
    }else{
        text_message = "Solo in privato posso rivelarti chi ha scritto il messaggio";
    }

    telegramBot.sendMessage(msg.chat.id, text_message);

    /*if (isAccepted) {
        telegramBot.sendMessage(msg.chat.id, "Hai già accettato! Ecco la lista delle cose che puoi chiedermi:\n\n" + listaComandi);
    }
    else {
        telegramBot.sendMessage(msg.chat.id, 'Grazie per aver accettato! Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
        isAccepted = true;
    } */
});

commands.on('/sendclaim', function (msg, telegramBot) {
    var array = msg.text.split(" ");    
    var id;
    var text_message;
    if (array[0][0]!=="#") {
        telegramBot.sendMessage(msg.chat.id, "Errore! L'ID deve iniziare per #");
    }
    else if(msg.chat.id !== CHAT_GROUP_ID) {
        id = Number(array[0].substring(1));
        db.collection('insulted').find({ID: id}).limit(1).next().then(function (insult) {
            if (insult == null) {
                text_message = "Errore! ID non valido, riprova!";
            }
            else {
                text_message = "L'insulto: #" + id + " E'stato scritto da: \n" + hideWord(insult.Nome) + " " + hideWord(insult.Cognome);
            }
            telegramBot.sendMessage(msg.chat.id, text_message);
        });
    }
});

/* funzione che maschera il nome e cognome, varia la lunghezza di entrambi */
function hideWord(word) {
    var i;
    var result = word[0];
    for(i=1;i<word.length;i++) {
        if(word[i]===" ") {
            result += "*";
        }else {
            if (Math.random()>0.6){
            result += "*";
            }
            if (Math.random()>0.8){
                result += word[i].toUpperCase();
            }else{
                result += "*";
            }
        }
    }    
    return result; 
}

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
}); */
    
/*
commands.on('/lezioni', function (msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, 'Mi dispiace, ma gli scansafatiche del LUG Roma Tre ancora non mi hanno' +
        ' insegnato come scrivere le lezioni odierne!');
});
*/

commands.on('/exit', function (msg, telegramBot) {
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
    /* sul gruppo Insulted/Spotted Roma Tre il Bot non deve parlare troppo! */
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
