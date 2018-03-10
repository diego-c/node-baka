"use strict";
/**
 * Error to be thrown if the provided protocol is incorrect
 * @extends Error
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ProtocolError = /** @class */ (function (_super) {
    __extends(ProtocolError, _super);
    /**
     * Instatiates a ProtocolError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    function ProtocolError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ProtocolError';
        return _this;
    }
    return ProtocolError;
}(Error));
module.exports = ProtocolError;
