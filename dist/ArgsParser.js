"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ArgsParser =
/*#__PURE__*/
function () {
  function ArgsParser() {
    _classCallCheck(this, ArgsParser);
  }

  _createClass(ArgsParser, null, [{
    key: "parse",
    value: function parse(rawArgs) {
      var args = new Map();

      for (var i = 0; i < rawArgs.length; i++) {
        rawArgs[i] = rawArgs[i].startsWith("--") ? rawArgs[i].substr(2) : rawArgs[i];

        if (["mode"].includes(rawArgs[i])) {
          if (i == rawArgs.length - 1 || rawArgs[i + 1].startsWith("--")) throw new Error("Missing value for ".concat(rawArgs[i], " argument"));
          args.set(rawArgs[i], rawArgs[i + 1]);
          i++;
          continue;
        }

        args.set(rawArgs[i], true);
      }

      return args;
    }
  }]);

  return ArgsParser;
}();

exports.default = ArgsParser;
//# sourceMappingURL=maps/ArgsParser.js.map
