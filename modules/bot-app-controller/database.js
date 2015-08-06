var mongoDbUrl = require('../../config.json')['mongoDbUrl'];
var MongoClient = require('mongodb').MongoClient;
var db = null;
var cbWaiting = [];

MongoClient.connect(mongoDbUrl, function (err, database) {
    if (err) throw err;
    db = database;
    while (cbWaiting.length > 0) {
        var cb = cbWaiting.pop();
        cb(database);
    }
});

module.exports = {
    getDbConnection: function (cb) {
        if (db == null) {
            cbWaiting.push(cb);
        }
        else {
            cb(db)
        }
    },
    /**
     * Foreach news insert if not exists else update if necessary
     * @param {Array} news
     */
    updateNews : function (news) {
        this.getDbConnection(function (db) {
            var collection = db.collection('news');
            for(var i = 0; i < news.length; i++){
                collection.update({
                    titolo: news[i].titolo
                },news[i],{upsert: true});
            }
        })
    }
};