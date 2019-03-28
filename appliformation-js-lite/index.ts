// Bootstrap de lancement de l'application
// permet la résolution de modules dans des répertoires autres que "node_modules"
var Module = require("module").Module;
import * as fs from "fs";
import * as path from "path";

var appDirectory = process.cwd();
var moduleDirectoriesContainer = [];
var moduleDirectories = [];
// On conserve la méthode originale pour rétablir le fonctionnement normal en cas d'un requireGlobal
Module._oldNodeModulePaths = Module._nodeModulePaths;

var NODE_MODULES_APP = path.join("node_modules", "app");


// on surcharge la méthode de résolution interne nodejs pour gérer d'autres répertoires
Module._newNodeModulePaths = function (from) {
    var paths = [];
    var matched = matchModuleDirectory(from);

    moduleDirectoriesContainer.forEach((path) => {
        paths.push(path);
    });
    paths.push(path.join(appDirectory, NODE_MODULES_APP));
    paths.push(path.join(matched || appDirectory));

    return paths;
};
Module._nodeModulePaths = Module._newNodeModulePaths;

function matchModuleDirectory(from) {
    var match = null, len = 0;
    for (var i = 0; i < moduleDirectories.length; i++) {
        var mod = moduleDirectories[ i ];
        if (from.indexOf(mod + path.sep) === 0 && mod.length > len) {
            match = mod;
            len = mod.length;
        }
    }
    return match;
}

function addModuleDirectory(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectories.indexOf(path2add) === -1) {
        moduleDirectories.push(path2add);
    }
}

function addModuleDirectoryContainer(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectoriesContainer.indexOf(path2add) === -1) {
        moduleDirectoriesContainer.push(path2add);
    }
}

function isNodeModule(directory) {
    // si un fichier 'package.json' existe, c'est un module nodejs
    var isModule = false;
    try {
        fs.statSync(path.normalize(path.join(directory, "package.json")));
        isModule = true;
    } catch (e) {
        isModule = false;
    }
    return isModule;
}

// Lecture et ajout dans le resolver des répertoires externes déclarés par le package courant
try {
    var builder = require("./builder.js");
    var os = require("os");
    let parentBuilderFile = path.join(process.cwd(), "../", "builder.js")

    if (fs.existsSync(parentBuilderFile)) {
        let parentBuilderJs = require(parentBuilderFile);
        if (parentBuilderJs.type === "parent") {
            if (builder.externalModules && builder.externalModules.enabled && builder.externalModules.directories) {
                builder.externalModules.directories.push(path.join(process.cwd(), "../"));
            }
        }
    }

    if (builder.externalModules && builder.externalModules.enabled && builder.externalModules.directories && builder.externalModules.directories.length > 0) {

        builder.externalModules.directories.forEach(function (directory) {
            try {
                directory = directory.replace("~", os.homedir());
                var stat = fs.statSync(directory);
                if (stat.isDirectory()) {

                    if (isNodeModule(directory)) {
                        addModuleDirectory(directory);
                        addModuleDirectoryContainer(path.normalize(path.join(directory, "..")));
                        console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme module nodejs");
                        console.log("MODULE RESOLVER > le répertoire '" + (path.normalize(path.join(directory, ".."))) + "' est déclaré comme container de module nodejs");
                    }
                    // on vérifie si des répertoires du 1er niveau sont des modules nodejs pour les ajouter eux aussi
                    var files = fs.readdirSync(directory);
                    var moduleFound = false;
                    files.forEach(function (file) {
                        let modPath = path.normalize(path.join(directory, file));
                        if (fs.statSync(modPath).isDirectory()) {
                            if (file.indexOf(".") === 0) return;

                            if (isNodeModule(modPath)) {
                                addModuleDirectory(modPath);
                                moduleFound = true;
                                console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est déclaré comme module nodejs");
                            } else {
                                console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est ignoré car ce n'est pas un module nodejs")
                            }
                        }
                    });
                    if (moduleFound) {
                        console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme container de module nodejs");
                        addModuleDirectoryContainer(directory);
                    }
                }
            } catch (e) {
                console.log("MODULE RESOLVER > erreur lors de la déclaration du répertoire externe '" + directory + "' :", e);
                process.exit(1);
            }
        });
    }
} catch (e) {
    // pas de fichier 'builder.js' >> mode production
    // on ignore en silence
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestion du cas particulier du main (car nodejs le considère différent des autres modules ...)  //
require.main.paths = [];
moduleDirectoriesContainer.forEach((path) => {
    require.main.paths.push(path);
});
require.main.paths.push(path.join(process.cwd()));
require.main.paths.push(path.join(process.cwd(), NODE_MODULES_APP));

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
AppSharedProps.set("sessionTimeout", Utils.config.get("server.sessionTimeout"));
AppSharedProps.set("notifSessionTimeout", Utils.config.get("server.notifications.sessionTimeoutDelay"));


// lancement de l'application
import { Server } from "src/server";
Server.startApplication();