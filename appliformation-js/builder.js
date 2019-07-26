const path = require("path");

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
         });*/

        gulp.addTaskDependency("package-zip-static", "prepare-package:spa");

        conf.template.forEach((elt, idx) => {
            if (conf.template[idx].context.forEach) {
                conf.template[idx].context.forEach((elt, idx2) => {
                    conf.template[idx].context[idx2].messages = {
                        "applicationTitle": "appliformation-js"
                    };
                });

            } else {
                conf.template[idx].context.messages = {
                    "applicationTitle": "appliformation-js"
                };
            }
        });
    },
    externalModules: {
        enabled: false,
        directories: [
        ]
    },
    config : {
        routesDirs: ["." + path.sep + "routes"],
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
                    message: "Oops! Accès interdit !"
                }
            ],
            dir: "./template/error",
            dest: "/error"
        }, {
            context: {
                message: "test template"
            }
        }]
    }
};
