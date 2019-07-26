import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { Client } from "hornet-js-core/src/client";
import { Routes } from "src/routes/routes";
import { HornetApp } from "src/views/layouts/hornet-app";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";
import { ReactClientInitializer } from "hornet-js-react-components/src/react/react-client";
import "src/injector-context-services-page";

(function startClient() {
    const logger: Logger = Logger.getLogger("appliformation-js-lite.client");

    function routeLoader(name: string, callback: any) {
        logger.info("routeLoaderClient(" + name + ")");
        // WEBPACK_AUTO_GENERATE_CLIENT_ROUTE_LOADING

        return null;
    }

    try {
        (<any>Error).stackTraceLimit = Infinity;

        let configClient = {
            appComponent: HornetApp,
            errorComponent: ErrorPage,
            routesLoaderfn: routeLoader,
            defaultRoutesClass: new Routes(),
            directorClientConfiguration: {
                html5history: true,
                strict: false,
                convert_hash_in_init: false,
                recurse: false,
                notfound: function () {
                    logger.error("Erreur. Cette route n'existe pas :'" + this.path + "'");
                }
            }
        };

        // On supprime le spinner de chargement de l'application
        // Cela ne gêne pas React car il est en dehors de sa div "app"
        let readyCallback = function () {
            var appLoading = document.getElementById("firstLoadingSpinner");
            if (appLoading) {
                appLoading.parentNode.removeChild(appLoading);
            }
        };

        let clientInit: ReactClientInitializer = new ReactClientInitializer(configClient.appComponent, readyCallback);

        Client.initAndStart(configClient, clientInit);
    } catch (exc) {
        logger.error("Erreur lors du chargement de l'appli côté client (Exception)", exc);
    }

})();
