const fs = require('fs');
const path = require("path");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const getModuleInfo = (file) => {
    const body = fs.readFileSync(file, 'utf-8');
    const ast = babelParser.parse(body, { sourceType: "module" });

    const deps = {};

    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(file);
            const absPath = './' + path.join(dirname, node.source.value);
            deps[node.source.value] = absPath;
        }
    })

    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    const moduleInfo = { file, deps, code };
    return moduleInfo;
}

const parseModules = (file) => {
    const entry = getModuleInfo(file);
    const temp = [entry];
    const depsGraph = {};
    for (let i = 0; i < temp.length; i++) {
        let deps = temp[i].deps;
        if (deps) {
            for (let key in deps) {
                let filePath = deps[key];
                if (filePath) {
                    temp.push(getModuleInfo(filePath));
                }
            }
        }
    }
    temp.forEach(moduleInfo => {
        const { file, code, deps } = moduleInfo;
        depsGraph[file] = {
            code,
            deps
        }
    })
    return depsGraph;
}

const bundle = (file) => {
    const depsGraph = JSON.stringify(parseModules(file));
    const data = `(function (graph) {
        function require(file) {
            function absRequire(relPath){
                return require(graph[file].deps[relPath])
            }
            const exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports;
        }
        require('${file}')
    })(${depsGraph})`;
    fs.writeFileSync("./demo/dist/bundle.js", data);
}

bundle("./demo/src/index.js");