"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var react_router_1 = require("react-router");

var react_router_config_1 = require("react-router-config");

var express = require("express");

var path = require("path");

var Logger_1 = require("./Logger");

var renderObject_1 = require("./renderObject");

var DataLoader_1 = require("./DataLoader");

var ArgsParser_1 = require("./ArgsParser");

var appData = require('./app/js/bundle.js').default;

var routes = appData.routes;
var emptyStore = appData.store;
var theme = appData.theme;
var app = express();
var args = ArgsParser_1.default.parse(process.argv.splice(2));
var logger = new Logger_1.default(path.join(__dirname, "log.txt"));
logger.init();
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
if (args["mode"] === "view") app.use(express.static(__dirname + '/public'));
app.get("ping", function (req, res) {
  res.status(200).end();
});
app.get("*",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var startMoment, loader, store, data, context, content, renderObject, resData, chunk;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Starting request " + req.url);
            startMoment = Date.now();
            _context.prev = 2;
            loader = new DataLoader_1.default(routes, req, args);
            store = Object.assign({}, emptyStore);
            _context.next = 7;
            return loader.load(store);

          case 7:
            data = _context.sent;
            context = {};
            content = React.createElement(react_router_1.StaticRouter, {
              location: req.url,
              context: context
            }, react_router_config_1.renderRoutes(routes));
            renderObject = new renderObject_1.default(content);
            if (args.has("mui")) renderObject.withMui(theme);else if (args.has("jss")) renderObject.withJss();
            if (!args.has("--no-redux")) renderObject.withRedux(data.store);
            if (args.has("mode") && args.get("mode") === "view") renderObject.withTemplate("\n                <!DOCTYPE html>\n                <html>\n                    <head>\n                        <meta charset=\"utf-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n                        <meta name=\"theme-color\" content=\"#000000\">\n                        <link rel=\"shortcut icon\" href=\"/static/favicon.ico\">\n                        <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bundle.css\">\n                        <title>".concat(data.title, "</title>\n                    </head>\n                    <body>\n                        <div id=\"root\">{{insertPoint}}</div>\n                        <script type=\"text/javascript\" src=\"/static/js/bundle.js\" defer></script>\n                    </body>\n                </html>\n            "));
            _context.next = 16;
            return renderObject.render();

          case 16:
            resData = _context.sent;
            res.status(context.status === 404 ? 404 : 200);
            res.append("Content-Type", "text/html; charset=utf-8");

            while (resData.length > 0) {
              chunk = resData.slice(0, resData.length > 4096 ? 4096 : resData.length);
              res.write(chunk);
              resData = resData.slice(chunk.length);
            }

            res.end();
            _context.next = 30;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](2);
            logger.logToFile(_context.t0);
            console.error(_context.t0);
            res.status(500);
            res.append("Content-Type", "text/plain; charset=utf-8");
            res.end(_context.t0.message);

          case 30:
            _context.prev = 30;
            console.log("Request \"".concat(req.url, "\" finished in ").concat(Date.now() - startMoment, " ms"));
            return _context.finish(30);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 23, 30, 33]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var PORT = process.env.PORT || 5001;
app.listen(PORT, function () {
  console.log("Server listening on: ".concat(PORT));
});
//# sourceMappingURL=server.js.map
