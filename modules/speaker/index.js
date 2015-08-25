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
Speaker.prototype.addQuestionType = function (questionName) {
    var q = this.questionNames[questionName] = {
        ask: null,
        response: null
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
 * Asks a question
 * @param questionName {string}
 * @param telegramId {number}
 * @param telegramBot {TelegramBot}
 * @param resolve {function} function to call on success
 * @param reject {function} function to call on error
 */
Speaker.prototype.ask = function (questionName, telegramId, telegramBot, resolve, reject) {
    var questionsPending = this.questionsPending;
    if (typeof this.questionNames[questionName] === 'undefined') {
        throw new Error('Question not defined');
    }
    var question = {
        telegramId: telegramId,
        questionName: questionName,
        resolve: function (data) {
            delete questionsPending[telegramId];
            resolve(data)
        },
        reject: function (err) {
            delete questionsPending[telegramId];
            reject(err)
        }
    };
    this.questionsPending[telegramId] = question;
    this.questionNames[questionName].ask(telegramId, telegramBot, question);
};

Speaker.prototype.handleResponse = function (msg, telegramBot) {
    var question = this.questionsPending[msg.from.id];
    if (typeof question === 'undefined') return false;
    var questionName = question.questionName;
    this.questionNames[questionName].response(msg, telegramBot, question);
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