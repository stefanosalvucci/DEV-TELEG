var database = require('../database');
var userManager = module.exports = {};

var USER_COLLECTION = 'users';

/**
 * Access to Database and return the User Object if found else null
 *
 * @param id of the user
 * @param cb callback function
 * @returns {*} User Object
 */
userManager.getUserById = function (id,cb){
    // TODO
    return null
};

/**
 * Access to Database and return the User Object if found else nulls
 *
 * @param id of Telegram user
 * @param cb callback function
 * @returns {*} User Object
 */
userManager.getUserByTelegramId = function (id, cb){
    database.getDbConnection(function (db) {
        var collection = db.collection(USER_COLLECTION);
        cb(collection.findOne({telegramId : id}));
    });
    return null
};

/**
 * This function searches in all users and returns only the items that match the filters
 *
 * @param filters array {filter_key: filter_value} i.e. { 'gender' : 'male', 'year' : '1'}
 * @param cb callback function
 * @returns {*} Array of User
 */
userManager.getUserList = function (filters,cb) {
    database.getDbConnection(function (db) {
        var collection = db.collection(USER_COLLECTION);
        cb(collection.find(filters).toArray());
    });
};

/**
 *  Add new user in Database
 *
 * @param user Object User
 * @param cb callback function
 * @returns {*} Error message | write confirmation
 */
userManager.newUser = function (user,cb) {
    database.getDbConnection(function (db) {
        var collection = db.collection(USER_COLLECTION);
        collection.insertOne(user, function (err, res) {
            if (err) cb(new Error(err));
            else cb(null,res);
        });
    })
};