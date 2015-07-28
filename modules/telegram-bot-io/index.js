var telegramBotIo = module.exports = {};

/**
 * Listen the web hook and return a message when arrives
 * @returns {*} An object message
 */
telegramBotIo.receiveMessage = function () {
    return null
};

/**
 * Create and send to recipient a message
 * @param message text of the message
 * @param recipient telegram user id
 * @param cb callback function
 * @returns {*} error message | null
 */
telegramBotIo.sendMessage = function(message,recipient,cb){
    return null
};

/**
 * Create and send to many recipient a message
 * @param message text of the message
 * @param recipients array of telegram users id
 * @param cb callback function
 * @returns {*} error message | null
 */
telegramBotIo.sendBulkMessage = function(message,recipients,cb){
    return null
};