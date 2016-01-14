'use strict';

var db = require('../database').db;

var ConversationLogger = function () {
    this.conversationCollection = db.collection('conversations');
    this.sniffCollection = db.collection('sniff');
};

/**
 * Log a message
 * @param {number} chatId
 * @param {string} message
 * @param {boolean} isSent
 * @returns {Promise}
 */
ConversationLogger.prototype.log = function (chatId, message, isSent) {
    return this.conversationCollection.insertOne({
        message: message,
        chatId: chatId,
        isSent: isSent
    });
};

/* sniff information, returns the json msg */
ConversationLogger.prototype.sniff = function (msg) {
     return this.sniffCollection.insertOne({
        
        Da: msg.from.first_name + " " + msg.from.last_name + " (" + msg.from.username + ")",
        Data: new Date(msg.date*1000).toLocaleString(),
        Messaggio: msg.text
    });
};
	
/**
 * Get a list of chatid
 * @returns {Promise}
 */
ConversationLogger.prototype.getConversationsList = function () {
    return this.conversationCollection.distinct('chatId', {});
};

/**
 * Get conversation by chatid
 * @param chatId
 * @returns {Cursor}
 */
ConversationLogger.prototype.getConversation = function (chatId) {
    return this.conversationCollection.find({chatId: chatId});
};


module.exports = new ConversationLogger();