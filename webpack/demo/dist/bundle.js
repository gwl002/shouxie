(function (graph) {
    function require(file) {
        function absRequire(relPath) {
            return require(graph[file].deps[relPath])
        }
        const exports = {};
        (function (require, exports, code) {
            eval(code)
        })(absRequire, exports, graph[file].code)
        return exports;
    }
    require('./demo/src/index.js')
})({ "./demo/src/index.js": { "code": "\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _minus = require(\"./minus.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar sum = (0, _add[\"default\"])(1, 2);\nvar division = (0, _minus.minus)(2, 1);\nconsole.log(sum);\nconsole.log(division);", "deps": { "./add.js": "./demo/src/add.js", "./minus.js": "./demo/src/minus.js" } }, "./demo/src/add.js": { "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = add;\n\nfunction add(a, b) {\n  return a + b;\n}", "deps": {} }, "./demo/src/minus.js": { "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.minus = void 0;\n\nvar minus = function minus(a, b) {\n  return a - b;\n};\n\nexports.minus = minus;", "deps": {} } })