"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var server_1 = require("react-dom/server");

var jss_1 = require("react-jss/lib/jss");

var JssProvider_1 = require("react-jss/lib/JssProvider");

var styles_1 = require("@material-ui/core/styles");

var react_redux_1 = require("react-redux");

var utils = require("util");

var compressor = require('yuicompressor');

compressor.compress = utils.promisify(compressor.compress);
var css = "";

var RenderObject =
/*#__PURE__*/
function () {
  function RenderObject(content) {
    _classCallCheck(this, RenderObject);

    this._result = "";
    this._pipeline = new Map();
    this._content = content;
  }

  _createClass(RenderObject, [{
    key: "_withJss",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function _withJss() {
      var _this = this;

      var sheetsRegistry, generateClassName;
      return regeneratorRuntime.wrap(function _withJss$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sheetsRegistry = new jss_1.SheetsRegistry();
              generateClassName = styles_1.createGenerateClassName();
              this._content = React.createElement(JssProvider_1.default, {
                registry: sheetsRegistry,
                generateClassName: generateClassName
              }, this._content);
              _context.next = 5;
              return this;

            case 5:
              if (!(typeof css === "undefined" || css === "")) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", compressor.compress(sheetsRegistry.toString(), {
                charset: 'utf8',
                type: 'css',
                'line-break': 80
              }).then(function (result) {
                css = result;
                return _this._result + "<style id=\"jss-server-side\">".concat(css, "</style>");
              }));

            case 9:
              return _context.abrupt("return", Promise.resolve(this._result + "<style id=\"jss-server-side\">".concat(css, "</style>")));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _withJss, this);
    })
  }, {
    key: "_withMui",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function _withMui(theme) {
      return regeneratorRuntime.wrap(function _withMui$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this._content = React.createElement(styles_1.MuiThemeProvider, {
                theme: theme,
                sheetsManager: new Map()
              }, this._content);
              _context2.next = 3;
              return this;

            case 3:
              return _context2.abrupt("return", Promise.resolve(this._result));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _withMui, this);
    })
  }, {
    key: "_withRedux",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function _withRedux(store) {
      var initialState;
      return regeneratorRuntime.wrap(function _withRedux$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this._content = React.createElement(react_redux_1.Provider, {
                store: store
              }, this._content);
              initialState = "<script>window.__INITIAL_STATE__ = ".concat(JSON.stringify(store.getState()), "</script>");
              _context3.next = 4;
              return this;

            case 4:
              return _context3.abrupt("return", Promise.resolve(this._result + initialState));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _withRedux, this);
    })
  }, {
    key: "_withTemplate",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function _withTemplate(template) {
      var inserted;
      return regeneratorRuntime.wrap(function _withTemplate$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this;

            case 2:
              inserted = template.replace(/\{\{.+\}\}/, this._result);
              return _context4.abrupt("return", Promise.resolve(inserted));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _withTemplate, this);
    })
  }, {
    key: "_addToPipeline",
    value: function _addToPipeline(gen) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var generator = gen.call.apply(gen, [this].concat(args));

      this._pipeline.set(gen.name, generator);

      return {
        execute: function execute() {
          return generator.next().value;
        }
      };
    }
  }, {
    key: "withJss",
    value: function withJss() {
      return this._addToPipeline(this._withJss).execute();
    }
  }, {
    key: "withMui",
    value: function withMui(theme) {
      if (this._pipeline.has("_withJss")) this._pipeline.delete("_withJss");
      return this._addToPipeline(this._withMui, theme).execute().withJss();
    }
  }, {
    key: "withRedux",
    value: function withRedux(store) {
      return this._addToPipeline(this._withRedux, store).execute();
    }
  }, {
    key: "withTemplate",
    value: function withTemplate(template) {
      return this._addToPipeline(this._withTemplate, template).execute();
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, kv;

        return regeneratorRuntime.wrap(function _callee$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this._result = server_1.renderToString(this._content);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context5.prev = 4;
                _iterator = this._pipeline[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context5.next = 14;
                  break;
                }

                kv = _step.value;
                _context5.next = 10;
                return kv[1].next().value;

              case 10:
                this._result = _context5.sent;

              case 11:
                _iteratorNormalCompletion = true;
                _context5.next = 6;
                break;

              case 14:
                _context5.next = 20;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context5.t0;

              case 20:
                _context5.prev = 20;
                _context5.prev = 21;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 23:
                _context5.prev = 23;

                if (!_didIteratorError) {
                  _context5.next = 26;
                  break;
                }

                throw _iteratorError;

              case 26:
                return _context5.finish(23);

              case 27:
                return _context5.finish(20);

              case 28:
                return _context5.abrupt("return", this._result);

              case 29:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee, this, [[4, 16, 20, 28], [21,, 23, 27]]);
      }));

      return function render() {
        return _render.apply(this, arguments);
      };
    }()
  }]);

  return RenderObject;
}();

exports.default = RenderObject;
//# sourceMappingURL=maps/RenderObject.js.map
