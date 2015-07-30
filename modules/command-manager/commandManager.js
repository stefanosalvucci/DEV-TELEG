var CommandManager = function () {
    this.commands = {}
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
 * Handle the msg. Please, do not use it elsewhere
 * @param msg
 * @param telegramBot An instance of Telegram
 */
CommandManager.prototype.handleMessage = function (msg, telegramBot) {
    var cb = this.commands[msg.text] || this.commands['/default'];
    cb(msg, telegramBot, null);
};

module.exports = new CommandManager();