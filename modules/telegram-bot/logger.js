const CHAT_GROUP_ID = -69948627;

'use strict';

var db = require('../database').db;

var ConversationLogger = function () {
    this.conversationCollection = db.collection('conversations');
    this.privateConversationCollection = db.collection('privateConversations');
    this.sniffCollection = db.collection('sniff'); //non servirà più
    this.groupCollection = db.collection('groupConversations');
    this.insultedCollection = db.collection('insulted');  
};

/**
 * Log a message
 * @param {number} chatId
 * @param {string} message
 * @param {boolean} isSent
 * @returns {Promise} */
ConversationLogger.prototype.log = function (chatId, message, isSent) {
  return this.conversationCollection.insertOne({
      message: message,
      chatId: chatId,
      isSent: isSent
  });
}; 

/* sniff information, returns the json msg, penso non serve +
ConversationLogger.prototype.sniff = function (msg) {
     return this.sniffCollection.insertOne({
          
        Da: msg.from.first_name + " " + msg.from.last_name + " (" + msg.from.username + ")",
        Data: new Date(msg.date*1000).toLocaleString(),
        Messaggio: msg.text
    });
};  */

/* Salvo sulla collection del gruppo Insulted/Spotted Roma Tre */
ConversationLogger.prototype.sniffInfoGruppo = function (msg){ 
  (msg.chat.id===CHAT_GROUP_ID) && this.groupCollection.insertOne({
      Da: msg.from.first_name + " " + msg.from.last_name + " (" + msg.from.username + ")",
      Data: new Date(msg.date*1000).toLocaleString(),
      Messaggio: msg.text,
      Message_ID: msg.message_id
    });  
};

/* Salvo sulla collection privata */
ConversationLogger.prototype.sniffInfoPrivato = function (msg){
  (msg.chat.id!==CHAT_GROUP_ID) && this.privateConversationCollection.insertOne({
      Da: msg.from.first_name + " " + msg.from.last_name + " (" + msg.from.username + ")",
      Data: new Date(msg.date*1000).toLocaleString(),
      Messaggio: msg.text
    }); 
};

/* Salvo sulla collection insulted gli insulti */
ConversationLogger.prototype.sniffInsulted = function (msg){
  (msg.chat.id!==CHAT_GROUP_ID) && (msg.text.substring(0,8)==="/insult ") && (msg.text.length>17) && this.insultedCollection.insertOne({
      ID: msg.message_id,
      Nome: msg.from.first_name,
      Cognome: msg.from.last_name,
      Username: msg.from.username,
      Messaggio: msg.text.substring(8),
      Data: new Date(msg.date*1000).toLocaleString()
    }); 
};
	
/**
 * Get a list of chatid
 * @returns {Promise} */ 
ConversationLogger.prototype.getConversationsList = function () {
    return this.conversationCollection.distinct('chatId', {});
}; 

/**
 * Get conversation by chatid
 * @param chatId
 * @returns {Cursor} */ 
ConversationLogger.prototype.getConversation = function (chatId) {
    return this.conversationCollection.find({chatId: chatId});
}; 


module.exports = new ConversationLogger();