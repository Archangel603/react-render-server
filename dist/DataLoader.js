"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_router_config_1 = require("react-router-config");

var pathToRegexp = require("path-to-regexp");

var DataLoader =
/*#__PURE__*/
function () {
  function DataLoader(routes, req, args) {
    _classCallCheck(this, DataLoader);

    this._useRedux = true;
    this._title = "";
    this._routes = routes;
    this._url = req.url;
    this._useRedux = !args.has("no-redux");
    this._query = this.parseQuery(req.query);
    this._host = req.get("X-LOCAL-HOST");
    if (typeof this._host === "undefined" || this._host === "") console.warn("Header X-LOCAL-HOST is not specified! No initial data will be loaded.");
  }

  _createClass(DataLoader, [{
    key: "parseQuery",
    value: function parseQuery(query) {
      var res = new Map();

      for (var key in query) {
        res.set(key, query[key]);
      }

      return res;
    }
  }, {
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(store) {
        var _this = this;

        var branch, promises;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof this._host === "undefined" || this._host === "")) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", {
                  store: store,
                  title: this._title
                });

              case 2:
                branch = react_router_config_1.matchRoutes(this._routes, this._url);
                promises = branch.map(function (_ref) {
                  var route = _ref.route;
                  var component = route.component;

                  if (component.configure) {
                    component.configure(_this._host);
                    return Promise.resolve();
                  }

                  var fetchData = component.fetchData;
                  var urlTemplate = component.urlTemplate;
                  if (component.title && _this._title === "") _this._title = component.title;
                  if (!(fetchData instanceof Function) || !_this._useRedux) return Promise.resolve();
                  var params,
                      keys = [],
                      url = new Map();

                  if (urlTemplate && urlTemplate !== "") {
                    params = pathToRegexp(urlTemplate, keys).exec(_this._url);

                    for (var i = 1; i < params.length; i++) {
                      url.set(keys[0].name, params[i]);
                    }
                  }

                  return fetchData(store, {
                    url: url,
                    query: _this._query
                  });
                });
                _context.next = 6;
                return Promise.all(promises);

              case 6:
                return _context.abrupt("return", {
                  store: store,
                  title: this._title
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function load(_x) {
        return _load.apply(this, arguments);
      };
    }()
  }]);

  return DataLoader;
}();

exports.default = DataLoader;
//# sourceMappingURL=DataLoader.js.map
