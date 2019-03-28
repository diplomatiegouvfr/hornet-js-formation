const path = require("path");

const clientContext = [
    [/moment[\/\\]locale$/, /fr|en/],
    [/intl[\/\\]locale-data[\/\\]jsonp$/, /fr|en/],
    [/^\.$/, (context) => {
        if (!/\/locale-data\//.test(context.context)) console.log("locale-daa", context);
        if (!/\/log4js\/lib$/.test(context.context)) return;
        context.regExp = /^\.\/appenders\/console.*$/;
        context.request = ".";
    }]
];

module.exports = {
    type: "application",
    authorizedPrerelease: "false",

    gulpTasks: function (gulp, project, conf, helper) {
        //Add task if needed
        /*gulp.beforeTask("compile", function () {
            helper.info("Exemple before compile task");
        });

        gulp.afterTask("compile", function () {
            helper.info("Exemple after compile task");
        });
         */
        helper.excludeNodeModulesFromWebpack(
            ["config", "continuation-local-storage", "sequelize", "pdfmake", "carbone", "csv-parser", "nodemailer"],
            conf.webPackConfiguration
        );
        // Exemple d'exclusion de fichiers/répertoires local à l'application
        // Cet exemple est complètement inutile puisque le client.js n'est pas dépendant des middlewares
        // Il est là à titre d'exemple uniquement
        /*        helper.excludeLocalFilesFromWebpack(
                    ["src/middleware"],
                    conf.webPackConfiguration
                );*/
        // Cas PARTICULIER de l'application tuto pour pouvoir la générer en mode SPA et ISOMORPHIC sur la PIC
        // => on force la tâche prepare-package:spa tout le temps
        // si mode fullSpa : on redéfini les tâches 'watch' & 'watch-prod' pour y inclure la tâche "prepare-package-spa"
        //gulp.task("watch", ["compile", "prepare-package:spa", "watch:client"]);
        //gulp.task("watch-prod", ["compile", "prepare-package:spa", "watch:client-prod"]);
        gulp.addTaskDependency("package-zip-static", "prepare-package:spa");
        conf.template.forEach((elt, idx) => {
            if (conf.template[idx].context.forEach) {
                conf.template[idx].context.forEach((elt, idx2) => {
                conf.template[idx].context[idx2].messages =  {"applicationTitle": "appliformation-js-lite"};
                });
            } else {
                conf.template[idx].context.messages =  {"applicationTitle": "appliformation-js-lite"};
            }
        });

    },
    externalModules: {
        enabled: false,
        directories: [
        ]
    },
    config: {
        routesDirs: ["." + path.sep + "routes"],
        ressources: ["database/**/*"],
        // Exemple d'exclusion de fichiers/répertoires local à l'application et de modules
        // Cet exemple n'est pas forcement cohérent puisque le client.js n'est pas dépendant des middlewares
        // Il est là à titre d'exemple uniquement
        clientExclude: {
            dirs: [
                path.join("src", "services", "data"),
                path.join("src", "dao"),
                "src/middleware",
                "nodemailer"
            ],
            filters: [
                path.join("src", "services", "data") + "/.*-data-\.*"
            ],
            modules: [
                "hornet-js-database",
                "config",
                "continuation-local-storage",
                "sequelize",
                "pdfmake",
                "carbone",
                "csv-parser",
                "nodemailer",
                "tls"
            ]
        },
        clientContext: clientContext,
        karma: {
            template: {
                debug: "./test/template/debug.html",
                context: "./test/template/context.html",
                clientContext: "./test/template/client_with_context.html"
            },
            clientContext: clientContext,
            clientExclude: {
                modules: ["cluster", "continuation-local-storage", "config", "cluster"]
            }
        },
        template: [{
            context: [{
                error: "404",
                suffixe: "_404",
                message: "Oops! Nous ne trouvons pas ce que vous cherchez!"
            }, {
                error: "500",
                suffixe: "_500",
                message: "Oops! Une erreur est survenue!"
            },
                {
                    error: "403",
                    suffixe: "_403",
                    message: "Oops! Accès interdit!"
                }
            ],
            dir: "./template/error",
            dest: "/error"
        }, {
            context: {
                message: "test template"
            }
        }],
        dev: {
            dllEntry: {
                vendor: ["hornet-js-react-components", "hornet-js-components", "hornet-js-utils", "hornet-js-core", "hornet-js-bean"]
            }
        }
    }
};