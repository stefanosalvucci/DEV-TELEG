var CommandManager = function () {
    this.commands = {};

    this.middlewares = [
        function (msg, telegramBot) {
            this.commands['/default'](msg, telegramBot);
        }.bind(this)
    ];
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
 * @param cb
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
    var cb = this.commands[msg.text];
    if (cb) {
        return cb(msg, telegramBot);
    }

    var i = this.middlewares.length - 1;
    var middleware = this.middlewares[i];
    middleware(msg, telegramBot, this.getNext(msg, telegramBot, i));
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
        this.middlewares[index - 1](msg, telegramBot, this.getNext(msg, telegramBot, index - 1));
    }.bind(this);
};

module.exports = new CommandManager();