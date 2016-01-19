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
    '\n/vote - Ottieni un voto dal tuo professore preferito!' +
    '\n/exit - Elimina le tue informazioni personali' +
    '\n/help - Mostra la lista dei comandi disponibili';

/* Controlla se l'utente ha accettato le condizioni */
function hasAccepted(userId){
    var user = new User(userId);
    user.collection.find({telegramId: user.telegramId}).limit(1).next().then(function(user){
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
    var user = new User(msg.from.id, telegramBot, msg.from.first_name, msg.from.last_name, msg.from.username);
    start_action(msg,telegramBot);
    user.collection.find({telegramId: user.telegramId}).limit(1).next().then(function (User) {
        (User===null) && user.addToDb();
    });
});

commands.on('/accept', function (msg, telegramBot) {
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user){
        if(user===null) {
            telegramBot.sendMessage(msg.chat.id, 'Errore! Non hai avviato il Bot, premi /start');
        }
        else {
            if(user.hasAccepted) {
                telegramBot.sendMessage(msg.chat.id, "Hai già accettato! Ecco la lista delle cose che puoi chiedermi:\n\n" + listaComandi);
            }
            else {
                telegramBot.sendMessage(msg.chat.id, 'Grazie per aver accettato! Ecco la lista delle cose che puoi chiedermi:\n\n' + listaComandi);
                setAccepted(msg.from.id);
            }
        }
    });
});

commands.on('/help', function (msg, telegramBot) {
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user){
        if(user===null) {
            telegramBot.sendMessage(msg.chat.id, 'Errore! Non hai avviato il Bot, premi /start');
        }
        if (user.hasAccepted) {
            telegramBot.sendMessage(msg.chat.id, "Regole del gioco: \nHai a disposizione 3 vite iniziali, il comando /claim costa una vita. Per guadagnare altre vite basta invitare un amico sul gruppo: Insulted/Spotted Roma tre.\nBuon divertimento! \n\n " +
            "Ecco la lista delle cose che puoi chiedermi:\n" + listaComandi);
        }
        else {
            start_action(msg, telegramBot);
        }
    });
});


commands.on('/spot', function (msg, telegramBot) {
    var text_message;
    var chat_id = msg.chat.id;
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user) {
        /* controllo se l'user ha accettato i termini o non ha fatto start */
        if(user===null) {
            text_message = 'Errore! Non hai avviato il Bot, premi /start';
        }
        else if(!user.hasAccepted) {
            text_message = "Non hai ancora accettato i termini, digita il comando /accept";
        }
        else {
            if(msg.chat.id!==CHAT_GROUP_ID) {
                if(!msg.text || msg.text.length<10) {
                    text_message = "Il comando /spot è costituito da: /spot + messaggio, digita correttamente il comando e scrivi il tuo spot!";
                }
                else {
                    text_message = "Spot #" + msg.message_id + "\n" + msg.text;
                    telegramBot.sendMessage(chat_id, "Lo spot è stato correttamente inviato nel gruppo!");
                    chat_id = CHAT_GROUP_ID;
                }
            }
            else {
                text_message = "il comando /spot non può essere usato nella chat di gruppo, scrivimi in privato!";
            }
        }
        telegramBot.sendMessage(chat_id, text_message);
    });
});

commands.on('/insult', function (msg, telegramBot) {
    var text_message;
    var chat_id = msg.chat.id;
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user) {
        /* controllo se l'user ha accettato i termini o non ha fatto start */
        if(user===null) {
            text_message = 'Errore! Non hai avviato il Bot, premi /start';
        }
        if(!user.hasAccepted) {
                text_message = "Non hai ancora accettato i termini, digita il comando /accept";
        }
        else {
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
        }
        telegramBot.sendMessage(chat_id, text_message);
    });
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
            text_message = "Per scoprire chi ha scritto il messaggio devi eseguire il comando \n /sendClaim seguito dall'ID e dal numero di cellulare su cui ti invieremo solo alcune lettere del nome della persona che ha scritto il messaggio #"+ message_id + "\n\n" +
                "ATTENZIONE: non vi sarà alcuna corrispondenza con la lunghezza del nome della persona!\n\nome" +
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

commands.on('/sendClaim', function (msg, telegramBot) {
    var array = msg.text.split(" ");
    var id;
    var text_message;
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user){
        /* controllo se lo user ha accettato i termini o non ha proprio fatto start */
        if(user===null) {
            return telegramBot.sendMessage(msg.chat.id, 'Errore! Non hai avviato il Bot, premi /start');
        }
        if(!user.hasAccepted) {
            return telegramBot.sendMessage(msg.chat.id, "Non hai ancora accettato i termini, digita il comando /accept");
        }
        /* primo controllo: user ha almeno 1 vita? */
        if(user.lives===0) {
        telegramBot.sendMessage(msg.chat.id, "Hai esaurito le vite! Per poter acquistare altre vite, invita un amico sul gruppo Insulted/Spotted Roma Tre!");
        }
        else {
            /* controlli sul comando*/
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
                        var residual_life = user.lives-1;
                        db.collection('users').updateOne({telegramId: user.telegramId}, {$set: {lives: (residual_life)}});
                        if (residual_life===1) {
                            var intro_message = "Hai ancora: 1 vita\n\n";
                        }
                        else if (residual_life===0) {
                            var intro_message = "Hai esaurito l'ultima vita! Aggiungi un amico al gruppo:\nInsulted/Spotted Roma Tre, riceverai una vita!\n\n";
                        }
                        else {
                            var intro_message = "Hai ancora: " + residual_life + " vite\n\n";
                        }
                        text_message = intro_message + "L'insulto: #" + id + " e'stato scritto da: \n" + hideWord(insult.Nome) + " " + hideWord(insult.Cognome);
                    }
                    telegramBot.sendMessage(msg.chat.id, text_message);
                });
            }
        }
    });
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

commands.on('/vote', function (msg, telegramBot) {
    var text_message;
    var chat_id = msg.chat.id;
    var rand_sticker_number;
    db.collection('users').find({telegramId: msg.from.id}).limit(1).next().then(function(user) {
        /* controllo se l'user ha accettato i termini o non ha fatto start */
        if(user===null) {
            text_message = 'Errore! Non hai avviato il Bot, premi /start';
        }
        else if(!user.hasAccepted) {
            text_message = "Non hai ancora accettato i termini, digita il comando /accept";
        }
        else {
            if(chat_id!==CHAT_GROUP_ID) {
                rand_sticker_number = Math.floor(Math.random() * 23);
                telegramBot.sendSticker(chat_id, randomSticker(rand_sticker_number));
                text_message = stickerMessage(rand_sticker_number) + (10+Math.floor(Math.random() * 20));
            }
            else {
                text_message = "il comando /vote non può essere usato nella chat di gruppo, scrivimi in privato!";
            }
        }
        telegramBot.sendMessage(chat_id, text_message);
    });
});
function randomSticker(rand_sticker_number){
    var stickers = [
        'BQADAgADGwADWl7kAfSRczM4ailXAg', // Di Battista
        'BQADAgADGQADWl7kAfEwJfps4tvUAg', // Gasparetti
        'BQADAgADFwADWl7kAceS-g-3icIcAg', // Limongelli
        'BQADAgADSAADWl7kAYQ-wmJwalFnAg', // Pizzonia
        'BQADAgADJAADWl7kATaSxF8zzcsnAg', // Torlone con parrucca
        'BQADAgADJgADWl7kAX2gld2Z2637Ag', // Limongelli in bianco e nero
        'BQADAgADJwADWl7kAaVIaAX1KN-pAg', // Miola
        'BQADAgADHwADWl7kAffEpBCbtTNEAg', // Cabibbo
        'BQADAgADKQADWl7kAbTMgwWQUeTbAg', // Benedetto santo
        'BQADAgADHQADWl7kATgkEn9Qj32tAg', // Crescenti
        'BQADAgADIgADWl7kAcnC9sw-fFnoAg', // Torlone tagliato verticalmente
        'BQADAgADKwADWl7kATp7PhtkkeECAg', // Ulivi in barca
        'BQADAgADLQADWl7kAQ-7RxFf_z-4Ag', // Pizzonia style
        'BQADAgADLwADWl7kAdYfvoS23ObqAg', // Pacciarelli
        'BQADAgADMQADWl7kAeJHtVFVTr5MAg', // Atzeni
        'BQADAgADNQADWl7kAV8j2ZPxTHVhAg', // Benedetto che corre
        'BQADAgADOAADWl7kAcavuotsECgdAg', // Torlone pensieroso
        'BQADAgADOgADWl7kAdriFtc0tjSaAg', // De Virgilio
        'BQADAgADPAADWl7kAeNV6KsFZ_TCAg', // Torlone al pc
        'BQADAgADPgADWl7kAZHLW7YbjDZuAg', // Sotgiu
        'BQADAgADQAADWl7kAT-08gSGJAqDAg', // Titto Thug Life
        'BQADAgADQgADWl7kASX6YgafWuWHAg', // Miola beve
        'BQADAgADRgADWl7kAVfDQVGQYfdFAg', // Natalini
        'BQADAgADSAADWl7kAYQ-wmJwalFnAg'  // Pizzonia
    ];
    return stickers[rand_sticker_number];
}
function stickerMessage(rand_sticker_number){
    var text_message = 'Salve alunno, il tuo voto ';
    var sticker_message = [
        'a Reti di Calcolatori', // Di Battista
        'a Fondamenti di Informatica', // Gasparetti
        'a Fondamenti di Informatica', // Limongelli
        'a Sicurezza informatica e delle Reti', // Pizzonia
        'a Big Data', // Torlone con parrucca
        'a Fondamenti di Informatica', // Limongelli in bianco e nero
        'a Fondamenti di Informatica', // Miola
        'ad Architetture Software', // Cabibbo
        'a Telecomunicazioni Wireless', // Benedetto santo
        'a Programmazione Concorrente', // Crescenti
        'a Big Data', // Torlone tagliato verticalmente
        'a Fondamenti di Automatica', // Ulivi in barca
        'a Sistemi Operativi', // Pizzonia style
        'a Ricerca Operativa', // Pacciarelli
        'a Basi di Dati 2', // Atzeni
        'a Fondamenti di Telecomunicazioni', // Benedetto che corre
        'a Calcolatori Elettronici', // Torlone pensieroso
        'ad Algoritmi e Strutture di Dati sarà', // De Virgilio
        'a Basi di Dati', // Torlone al pc
        'a Chimica', // Sotgiu
        'a Informatica Teorica', // Titto Thug Life
        'a Fondamenti di Informatica', // Miola beve
        'a Analisi Matematica', // Natalini
        'a Sicurezza informatica e delle Reti'  // Pizzonia
    ];
    text_message += sticker_message[rand_sticker_number] + ' sarà: ';
    return text_message;
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
