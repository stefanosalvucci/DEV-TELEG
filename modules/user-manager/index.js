var database = require('../database').db;
var dipartimenti = require('../dipartimenti');

var Speaker = function () {
    this.questionsPending = {}
};

Speaker.prototype.handleResponse = function (msg, telegramBot) {
    var questionPending = this.questionsPending[msg.from.id];
    var response;
    if (typeof questionPending === 'undefined') return false;
    switch (questionPending.questionType) {
        case 1:
            response = this.responseDipartimento;
            break;
        default:
            return false;
    }
    response.call(this, msg, telegramBot, questionPending);
    return true;
};

Speaker.prototype.askDipartimento = function (telegramId, telegramBot, resolve) {
    var message = "Di quale dipartimento fai parte?";
    for (var i = 1; i < dipartimenti.length; i++) {
        message += '\n' + i + ') ' + dipartimenti[i].name;
    }
    telegramBot.sendMessage(telegramId, message);
    this.questionsPending[telegramId] = {
        questionType: 1,
        resolve: resolve
    };
};

Speaker.prototype.responseDipartimento = function (msg, telegramBot, question) {
    delete this.questionsPending[msg.from.id];
    question.resolve(parseInt(msg.text));
};

Speaker.prototype.askFacolta = function (telegramId, telegramBot, resolver) {
    this.telegramBot.sendMessage(telegramId, message);
    this.questionsPending[telegramId] = 2;
};

var User = function (telegramId, telegramBot) {
    this.telegramBot = telegramBot;
    this.telegramId = telegramId;
    this.collection = database.collection('users');
};


User.prototype.getDipartimento = function () {
    var that = this;
    return this.getUser().then(function (user) {
        if (!user.dipartimentoId) {
            return new Promise(function (resolve, reject) {
                speaker.askDipartimento(that.telegramId, that.telegramBot, resolve);
            });
        }
        return Promise.resolve(user.dipartimentoId);
    }).catch(function (err) {
        console.error(err);
    });
};

/**
 * Access to Database and return the User Object if found else null
 *
 * @param {number} id of the user
 * @returns {Promise}
 */
/*User.prototype.getUserById = function (id) {
 return this.collection.findOne({_id: id});
 };*/

/**
 * Access to Database and return the User Object or create it
 *
 * @returns {Promise}
 */
User.prototype.getUser = function () {
    var collection = this.collection;
    var telegramId = this.telegramId;
    return collection.findOne({telegramId: telegramId}).then(function (user) {
        if (user == null) {
            return collection.insertOne({
                telegramId: telegramId
            });
        }
        return Promise.resolve(user);
    });
};

/**
 * This function searches in all users and returns only the items that match the query
 *
 * @param {object} query The cursor query object.
 * @returns {Cursor}
 */
/*User.prototype.getUserList = function (query) {
 return this.collection.find(query);
 };*/

/**
 *  Add new user in Database
 *
 * @param {object} user Object User
 * @returns {Promise}
 */
/*User.prototype.newUser = function (user) {
 return this.collection.insertOne(user);
 };*/

var speaker = new Speaker();

module.exports = {
    User: User,
    Middleware: function (msg, telegramBot, next) {
        if (!speaker.handleResponse(msg, telegramBot)) {
            next();
        }
    }
};
