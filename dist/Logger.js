"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require("fs");

var util = require("util");

var Logger =
/*#__PURE__*/
function () {
  function Logger(logPath) {
    _classCallCheck(this, Logger);

    this.isInitialized = false;
    this._logPath = logPath;
  }

  _createClass(Logger, [{
    key: "init",
    value: function init() {
      if (!fs.existsSync(this._logPath)) fs.writeFileSync(this._logPath, "");
      this.isInitialized = true;
    }
  }, {
    key: "logToFile",
    value: function logToFile(message) {
      var date = new Date(Date.now());
      var output = "[".concat(date.toLocaleString(), "] ").concat(message);
      fs.appendFileSync(this._logPath, output);
    }
  }]);

  return Logger;
}();

exports.default = Logger;
//# sourceMappingURL=maps/Logger.js.map
