'use strict';

var dipartimenti = require('../dipartimenti');
var speaker = require('../speaker');
var utils = require('../utils');
var InputValidationError = require('../../lib/errors').InputValidationError;

var askDipartimento = function (telegramId, telegramBot, question) {
    var nDipartimenti = dipartimenti.length - 1;
    var cols = 4;
    var message = "Di quale dipartimento fai parte?";
    for (var i = 1; i < dipartimenti.length; i++) {
        message += '\n' + i + ') ' + dipartimenti[i].name;
    }
    telegramBot.sendMessage(telegramId, message, {
        reply_markup: JSON.stringify({
            keyboard: utils.generateArrayOfArrayOfNumbers(1, nDipartimenti, Math.ceil(nDipartimenti / cols), cols),
            resize_keyboard: true,
            one_time_keyboard: true
        })
    });
};

var responseDipartimento = function (msg, telegramBot, question) {
    var dipartimentoUtente = parseInt(msg.text);
    if (dipartimentoUtente) {
        if (dipartimentoUtente > dipartimenti.length - 1 || dipartimentoUtente < 1)
            return question.reject(new InputValidationError('Questo numero non è un dipartimento valido.'));
        return question.resolve(dipartimentoUtente);
    } else {
        return question.reject(new InputValidationError('Ho bisogno del numero del dipartimento per capire cosa intendi.'))
    }
};

speaker.addQuestion('dipartimento').ask(askDipartimento).response(responseDipartimento);
