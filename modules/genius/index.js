'use strict';

/**
 * Brain is a AI module who simplify the interaction with user recognizing sentences.
 * @module
 */

var brain = require('brain');
var phrases = require('./sentences.json');
var commands = require('../command-manager');

var net = new brain.NeuralNetwork();

var makeDict = function (str) {
    var ar = str.split(' ');
    var oj = {};
    ar.forEach(function (item) {
        oj[item] = 1;
    });
    return oj;
};

var normalizeSentence = function (sentence) {
    return sentence.toLowerCase().replace(/[^a-z ]/g, "");
};

var init = function () {
    var data = [];

    var keys = Object.keys(phrases);
    keys.forEach(function (key) {
        var list = phrases[key];
        list.forEach(function (p) {
            var a = {
                input: makeDict(p),
                output: {}
            };
            a.output[key] = 1;
            data.push(a)
        });
    });

    net.train(data);
};

init();

module.exports = {
    Middleware: function (msg, telegramBot, next) {
        var stats = net.run(makeDict(normalizeSentence(msg.text)));
        for (var command in stats) {
            if (stats.hasOwnProperty(command) && stats[command] > 0.5) {
                return commands.commands['/' + command](msg, telegramBot, next);
            }
        }
        console.log(stats);
        return next();
    }
};