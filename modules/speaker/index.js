var Speaker = function () {
    this.questionsPending = {};
    this.questionNames = {};
};

/**
 * Adds a new question.
 *
 * e.g.
 * speaker
 *   .addQuestionType('questionName')
 *   .ask(function (telegramId, telegramBot, question) {})
 *   .response(function (msg, telegramBot, question) {question.resolve(data)});
 * @param questionName {string} the name of this
 * @returns {{ask: Function, response: Function}}
 */
Speaker.prototype.addQuestion = function (questionName) {
    var q = this.questionNames[questionName] = {
        askF: null,
        responseF: null
    };
    var that = {
        ask: function (cb) {
            q.ask = cb;
            return that;
        },
        response: function (cb) {
            q.response = cb;
            return that;
        }
    };
    return that;
};

/**
 /**
 * Asks a question
 * @param questionName {string}
 * @param telegramId {number}
 * @param telegramBot {TelegramBot}
 * @returns {Promise}
 */
Speaker.prototype.ask = function (questionName, telegramId, telegramBot) {
    var that = this;
    if (typeof this.questionNames[questionName] === 'undefined') {
        throw new Error('Question not defined');
    }
    return new Promise(function (resolve, reject) {
        var question = {
            telegramId: telegramId,
            questionName: questionName,
            resolve: function (data) {
                delete that.questionsPending[telegramId];
                resolve(data)
            },
            reject: function (err) {
                delete that.questionsPending[telegramId];
                reject(err)
            }
        };
        that.questionsPending[telegramId] = question;
        that.questionNames[questionName].askF(telegramId, telegramBot, question);
    });
};

Speaker.prototype.handleResponse = function (msg, telegramBot) {
    var question = this.questionsPending[msg.from.id];
    if (typeof question === 'undefined') return false;
    var questionName = question.questionName;
    this.questionNames[questionName].responseF(msg, telegramBot, question);
    //response.call(this, msg, telegramBot, question);
    return true;
};

var speaker = new Speaker();
speaker.Middleware = function (msg, telegramBot, next) {
    if (!speaker.handleResponse(msg, telegramBot)) {
        next();
    }
};
module.exports = speaker;