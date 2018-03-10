"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var speed = require('speedometer')();
var getSpeed = function (dataLength) {
    return speed(dataLength);
};
exports.getSpeed = getSpeed;
