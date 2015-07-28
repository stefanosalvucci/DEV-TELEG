var userManager = module.exports = {};

/**
 * Access to Database and return the User Object if found else null
 *
 * @param id of the user
 * @param cb callback function
 * @returns {*} User Object
 */
userManager.getUserById = function (id,cb){
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
    return null
};

/**
 *  Add new user in Database
 *
 * @param user Object User
 * @param cb callback function
 * @returns {*} Error message | null
 */
userManager.newUser = function (user,cb) {
    return null
};