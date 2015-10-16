'use strict';

var mongoDbUrl = require('../etc/config').mongoDbUrl;
var MongoClient = require('mongodb').MongoClient;
var db = null;

module.exports = {
  /**
   * Get the mongo Db instance
   * @returns {Db}
   */
  get db() {
    return db;
  },

  /**
   * Connect to mongo database. You must wait for this before starting the server.
   * @returns {Promise}
   */
  connect: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(mongoDbUrl, {promiseLibrary: Promise}, function (err, database) {
        if (err) return reject(err);
        db = database;
        console.log('Db connected');
        resolve(db);
      });
    });
  },

  /**
   * Foreach news insert if not exists else update if necessary
   * @param {Array} news
   * @returns {Promise}
   */
  updateNews: function (news) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection('news');
      var promises = [];
      news.forEach(function (element) {
        promises.push(collection.updateOne({titolo: element.titolo}, element, {upsert: true}));
      });
      Promise.all(promises).then(function (values) {
        console.log('[NEWS] Database updated');
        resolve(values);
      }).catch(function (error) {
        reject(error);
      });
    });

  }
};
