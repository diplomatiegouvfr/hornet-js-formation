// L'import de hornet-js-utils doit être fait le plus tôt possible
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import * as fs from "fs";
import { AppliI18nLoader } from "src/i18n/app-i18n-loader";
import { ServerConfiguration } from "hornet-js-core/src/server-conf";
import * as HornetServer from "hornet-js-core/src/server";
import { HornetApp } from "src/views/layouts/hornet-app";
import { HornetLayout } from "src/views/layouts/hornet-layout";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";



// import { AuthenticationAPIMiddleware } from "src/middleware/authentication-api";

import { Routes } from "src/routes/routes";
import {
    PageRenderingMiddleware,
    UnmanagedViewErrorMiddleware
} from "hornet-js-react-components/src/middleware/component-middleware";
import * as HornetMiddlewares from "hornet-js-core/src/middleware/middlewares";
import { HornetMiddlewareList } from "hornet-js-core/src/middleware/middlewares";
import * as DataBaseMiddlewares from "hornet-js-database/src/middleware/middleware";

// Authent passport
import { PassportAuthentication } from "hornet-js-passport/src/passport-authentication";
import { AuthenticationtConfiguration } from "hornet-js-passport/src/authentication-configuration";
// Saml
import { SamlConfiguration } from "hornet-js-passport/src/strategy/saml/saml-configuration";
import { SamlStrategy } from "hornet-js-passport/src/strategy/saml/saml-strategy";

import { Database } from "hornet-js-database/src/sequelize/database";
import { Injector } from "hornet-js-core/src/inject/injector";

import * as Menu from "src/resources/navigation.json";
// Mise en place des injections de service
const logger: Logger = Logger.getLogger("appliformation-js-lite.server");

async function initContext() {
    await import("src/injector-context-services-data");
    await import("src/injector-context-services-page");
    return await import("src/middleware/authentication-api");
}

let AuthenticationAPIMiddleware;

/*
let AuthenticationAPIMiddleware;
initContext().then(
    (AuthenticationAPI)=> {
        AuthenticationAPIMiddleware = AuthenticationAPI
    });
*/

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
            routesLoaderPaths: [ "src/routes/" ],
            /*Directement un flux JSON >>internationalization:require("./i18n/messages-fr-FR.json"),*/
            /*Sans utiliser le système clé/valeur>> internationalization:null,*/
            internationalization: new AppliI18nLoader(),
            menuConfig: (<any>Menu).menu,
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
            .addAfter(UnmanagedViewErrorMiddleware, HornetMiddlewares.DataRenderingMiddleware)
            .addBefore(DataBaseMiddlewares.DataBaseErrorMiddleware, HornetMiddlewares.UnmanagedDataErrorMiddleware);

        if (Utils.config.getOrDefault("authentication.saml.enabled", false)) {

            let configAuth = new AuthenticationtConfiguration(
                Utils.config.get("authentication.loginUrl"),
                Utils.config.get("authentication.logoutUrl")
            );

            let authent = new PassportAuthentication(configAuth);
            let configuration = new SamlConfiguration(
                Utils.config.get("authentication.saml.configuration.callbackUrl"),
                Utils.config.get("authentication.saml.configuration.logoutCallbackUrl"),
                // Page de retour par défaut
                Utils.config.get("authentication.saml.configuration.hostUrlReturnTo"),
                // Usually specified as `/shibboleth` from site root
                Utils.config.get("authentication.saml.configuration.issuer"),
                // Certificat applicatif
                fs.readFileSync(__dirname + "/../config/cert/cert.pem", "utf8"),
                // Clé privée de décryptage
                fs.readFileSync(__dirname + "/../config/cert/key.pem", "utf8"),
                Utils.config.get("authentication.saml.configuration.idp")
            );
            authent.initStrategy(new SamlStrategy(configuration));

            hornetMiddlewareList.addAfter(authent.getMiddleware(), HornetMiddlewares.ChangeI18nLocaleMiddleware);
        } else {
            hornetMiddlewareList.addAfter(AuthenticationAPIMiddleware, HornetMiddlewares.ChangeI18nLocaleMiddleware);
        }
        return hornetMiddlewareList;
    }

    static startApplication() {

        initContext().then((AuthenticationAPI) => {

            if (process.env.NODE_ENV !== "production" &&
                !Utils.config.getOrDefault("mock.enabled", false) &&
                !Utils.config.getOrDefault("mock.serviceData.enabled", false)) {
                let files;
                let databaseConfName = Injector.getRegistered("databaseConfigName");
                if (databaseConfName === "config") {
                    files = [ "database/01_createTablesSqlite.sql", "database/02_initDataSqlite.sql" ];
                } else if (databaseConfName === "configPostgres") {
                    files = [ "database/01_createTablesPostgres.sql", "database/02_initDataPostgres.sql" ];
                }

                Database.runScripts([ {
                    configName: databaseConfName,
                    files: files
                }]).then(() => {
                    Server.start(AuthenticationAPI);
                });
            } else {
                Server.start(AuthenticationAPI);
            }
        });
    }

    static start(AuthenticationAPI) {


        AuthenticationAPIMiddleware = AuthenticationAPI.AuthenticationAPIMiddleware;
        let server = new HornetServer.Server(Server.configure(), Server.middleware());
        server.start();


    }
}
