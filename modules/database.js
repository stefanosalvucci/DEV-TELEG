var mongoDbUrl = require('../config.json')['mongoDbUrl'];
var MongoClient = require('mongodb').MongoClient;
var db = null;

module.exports = {

    /**
     * @param cb
     * @deprecated use db field
     */
    getDbConnection: function (cb) {
        cb(db);
    },

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
     * TODO return Promise
     */
    updateNews: function (news) {
        this.getDbConnection(function (db) {
            var collection = db.collection('news');
            for (var i = 0; i < news.length; i++) {
                collection.update({
                    titolo: news[i].titolo
                }, news[i], {upsert: true});
            }
        })
    }
};