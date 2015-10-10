'use strict';

/**
 * Some custom errors
 * @module
 */

var util = require('util');

exports.InputValidationError = function InputValidationError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
};

util.inherits(module.exports, Error);