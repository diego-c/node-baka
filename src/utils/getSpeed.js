"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const speed = require('speedometer')();
const getSpeed = (dataLength) => {
    return speed(dataLength);
};
exports.getSpeed = getSpeed;
