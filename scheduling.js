'use strict';

var schedule = require('node-schedule');
var orari = require('./modules/orari-roma3');

var j = schedule.scheduleJob('0 6 * * *', function () {
    orari.updateDb();
});