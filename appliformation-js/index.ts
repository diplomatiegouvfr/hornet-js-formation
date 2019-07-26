// Bootstrap de lancement de l'application
// permet la résolution de modules dans des répertoires autres que "node_modules"
const Module = require("module").Module;
import * as fs from "fs";
import * as path from "path";

const appDirectory = process.cwd();
// On conserve la méthode originale pour rétablir le fonctionnement normal en cas d'un requireGlobal
Module._oldNodeModulePaths = Module._nodeModulePaths;

const NODE_MODULES = "node_modules";

Module.prototype._oldCompile = Module.prototype._compile;
Module.prototype._compile = function (content, filename) {
    if ((path.extname(filename) === ".scss") || (path.extname(filename) === ".svg")) {
        content = "module.exports = {};";
    }
    return this._oldCompile(content, filename);
};


// on surcharge la méthode de résolution interne nodejs pour gérer d'autres répertoires
Module._newNodeModulePaths = function (from) {
    var paths = Module._oldNodeModulePaths.call(this, from);
    paths.push(path.join(appDirectory));
    paths.push(path.join(appDirectory, NODE_MODULES));

    let modulePath = from
    do {
        if(fs.existsSync(path.join(modulePath, NODE_MODULES))) {
            paths.push(path.join(modulePath, NODE_MODULES));
        }
        modulePath = path.dirname(modulePath)
    } while(modulePath.length > 1)
    return paths;
};
Module._nodeModulePaths = Module._newNodeModulePaths;


////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestion du cas particulier du main (car nodejs le considère différent des autres modules ...)  //
require.main.paths = [];
require.main.paths.push(path.join(process.cwd()));
require.main.paths.push(path.join(process.cwd(), NODE_MODULES));

////////////////////////////////////////////////////////////////////////////////////////////////////

// gestion des sourcemap dans les stack nodejs
require("source-map-support").install();

// autorise le format json5 dans les extensions .json
import { JSONLoader } from "hornet-js-utils/src/json-loader";
JSONLoader.allowJSON5();

// auto configuration des logs server
import { ServerLogConfigurator } from "hornet-js-core/src/log/server-log-configurator";
ServerLogConfigurator.configure();

// initialisation des infos de l'application courante
import { AppSharedProps } from "hornet-js-utils/src/app-shared-props";
import { Utils } from "hornet-js-utils";
var packageJson = require("./package");
AppSharedProps.set("appName", packageJson.name);
AppSharedProps.set("appVersion", packageJson.version);
AppSharedProps.set("appDescription", packageJson.description);
AppSharedProps.set("appAuthor", packageJson.author);
AppSharedProps.set("clientSessionConfig", {
    sessionTimeout: Utils.config.get("server.sessionTimeout"),
    notifSessionTimeout: Utils.config.get("server.notifications.sessionTimeoutDelay"),
    notifSessionTimeoutRepeat: Utils.config.get("server.notifications.notifSessionTimeoutRepeat")
});

// lancement de l'application
import { Server } from "src/server";
Server.startApplication();