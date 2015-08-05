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
    }
};