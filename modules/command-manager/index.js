'use strict';


/**
 * CommandManager take a message, do an action and call a callback for response
 * @constructor
 */
var CommandManager = function () {
    this.commands = {};

    this.middlewares = [];
};

/**
 * Call a cb when the message was received
 * @param message The message that triggers the callback
 * @param cb The callback triggered by the message
 */
CommandManager.prototype.on = function (message, cb) {
    this.commands[message] = cb;
};

/**
 * Add a middleware
 * @param middleware
 */
CommandManager.prototype.use = function (middleware) {
    this.middlewares.push(middleware);
};


/**
 * Handle the msg. Please, do not use it elsewhere
 * @param msg
 * @param telegramBot An instance of Telegram
 */
CommandManager.prototype.handleMessage = function (msg, telegramBot) {
    var cb = this.commands[msg.text.substring(0,msg.text.indexOf(" "))] || this.commands[msg.text]
    if (cb) {
        msg.text = msg.text.substring(cb.length+1)
        return cb(msg, telegramBot);
    }

    var middleware = this.middlewares[0];
    middleware(msg, telegramBot, this.getNext(msg, telegramBot, 0));
};


/**
 * Get the next function
 * @param msg
 * @param telegramBot
 * @param index
 * @returns {function(this:CommandManager)}
 */
CommandManager.prototype.getNext = function (msg, telegramBot, index) {
    return function () {
        this.middlewares[index + 1](msg, telegramBot, this.getNext(msg, telegramBot, index + 1));
    }.bind(this);
};

module.exports = new CommandManager();