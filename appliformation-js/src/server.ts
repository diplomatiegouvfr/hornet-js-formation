// L'import de hornet-js-utils doit être fait le plus tôt possible
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as fs from "fs";
import { I18nLoader } from "hornet-js-core/src/i18n/i18n-loader"
import { ServerConfiguration } from "hornet-js-core/src/server-conf";
import * as HornetServer from "hornet-js-core/src/server";
import { HornetApp } from "src/views/layouts/hornet-app";
import { HornetLayout } from "src/views/layouts/hornet-layout";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";
import { Routes } from "src/routes/routes";
import {
    PageRenderingMiddleware,
    UnmanagedViewErrorMiddleware
} from "hornet-js-react-components/src/middleware/component-middleware";
import * as HornetMiddlewares from "hornet-js-core/src/middleware/middlewares";

import { HornetMiddlewareList } from "hornet-js-core/src/middleware/middlewares";

import * as Menu from "src/resources/navigation.json";
import "src/injector-context";

async function initContext() {
    await import("src/injector-context");
    return await import("src/middleware/authentication-api");
}

let AuthenticationAPIMiddleware;

const logger: Logger = Utils.getLogger("appliformation-js.server");

export class Server {

    static configure(): ServerConfiguration {

        let configServer: ServerConfiguration = {
            serverDir: __dirname,
            staticPath: "../static",
            appComponent: HornetApp,
            layoutComponent: HornetLayout,
            errorComponent: ErrorPage,
            defaultRoutesClass: new Routes(),
            sessionStore: null, // new RedisStore({host: "localhost",port: 6379,db: 2,pass: "RedisPASS"}),
            routesLoaderPaths: ["src/routes/"],
            /*Directement un flux JSON >>internationalization:require("./i18n/messages-fr-FR.json"),*/
            /*Sans utiliser le système clé/valeur>> internationalization:null,*/
            internationalization: new I18nLoader(),
            menuConfig: (<any> Menu).menu,
            loginUrl: Utils.config.get("authentication.loginUrl"),
            logoutUrl: Utils.config.get("authentication.logoutUrl"),
            welcomePageUrl: Utils.config.get("welcomePage"),
            publicZones: [
                Utils.config.get("welcomePage")
            ]
        };

        const key = Utils.config.getOrDefault("server.https.key", false);
        const cert = Utils.config.getOrDefault("server.https.cert", false);
        if (key && cert) {
            configServer.httpsOptions = {
                key: fs.readFileSync(key, "utf8"),
                cert: fs.readFileSync(cert, "utf8"),
                passphrase: Utils.config.get("server.https.passphrase")
            };
        }
        return configServer;
    }

    static middleware(): HornetMiddlewareList {
        let hornetMiddlewareList = new HornetMiddlewares.HornetMiddlewareList()
            .addAfter(PageRenderingMiddleware, HornetMiddlewares.UserAccessSecurityMiddleware)
            .addAfter(UnmanagedViewErrorMiddleware, HornetMiddlewares.DataRenderingMiddleware);
        hornetMiddlewareList.addAfter(AuthenticationAPIMiddleware, HornetMiddlewares.ChangeI18nLocaleMiddleware);
        return hornetMiddlewareList;
    }

    static startApplication() {
        initContext().then(
            (AuthenticationAPI) => {
                AuthenticationAPIMiddleware = AuthenticationAPI.AuthenticationAPIMiddleware;
                let server = new HornetServer.Server(Server.configure(), Server.middleware());
                server.start();
            }
        );
    }
}