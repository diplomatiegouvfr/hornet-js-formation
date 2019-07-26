import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";

const sha1 = require("sha1");
const flash = require("connect-flash");

import { Request, Application } from "express";
import * as ReactDOMServer from "react-dom/server";
import * as passport from "passport";
import { Strategy } from "passport-local";
import * as _ from "lodash";
import { ConnexionPage } from "src/views/gen/gen-cnx-page";
import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
import { AuthService } from "src/services/data/auth/auth-service";

export class AuthenticationMiddleware extends AbstractHornetMiddleware {

    private static logger: Logger = Logger.getLogger("appliformation-js-lite.middleware.authentication");

    protected api: AuthService;

    public insertMiddleware(app: Application) {
        // init passport
        /**
         * Insertion de la stratégie login/mot de passe (= stratégie 'locale', voir doc passport)
         */
        passport.use(new Strategy(
            function (_api) {
                return function (username, password, done) {
                    AuthenticationMiddleware.logger.trace("Tentative d'authentification de l'utilisateur ", username);

                    let encodedPassword = sha1(password);
                    _api.auth({
                        login: username,
                        password: encodedPassword
                    }).then(
                        retourApi => {
                            AuthenticationMiddleware.logger.debug("Retour API utilisateur : ", retourApi);
                            done(null, retourApi);
                        }).catch(err => {
                            AuthenticationMiddleware.logger.warn("Retour en erreur:", err);
                            if (err.code == "ERR_AUTHENTICATION_FAILED") {
                                done(null, false, {message: "Votre identifiant ou votre mot de passe est incorrect"});
                            } else {
                                done(null, false, {message: "Une erreur technique est survenue : " + err.toString()});
                            }
                        }
                    );
                };
            }(this.api)
        ));
        passport.serializeUser(function (user, done) {
            // Pour l'appli on sérialise tout l'objet plutot que juste son ID
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // init middleware
        let loginUrl = Utils.appSharedProps.get("loginUrl");
        let logoutUrl = Utils.appSharedProps.get("logoutUrl");
        let welcomePageUrl = Utils.appSharedProps.get("welcomePageUrl");

        function ensureAuthenticated(req: Request, res, next) {
            if (req.isAuthenticated() || _.startsWith(req.originalUrl, loginUrl)) {
                return next();
            }
            req.getSession().setAttribute("previousUrl", Utils.buildContextPath(req.originalUrl));
            res.redirect(Utils.buildContextPath(loginUrl));
        }

        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.post(loginUrl,
            passport.authenticate("local", {failureRedirect: Utils.buildContextPath(loginUrl), failureFlash: true}),
            function (req: Request, res, next) {
                AuthenticationMiddleware.logger.trace("Authentification ok, redirection vers la page d'accueil");
                let previousUrl = req.body.previousUrl || req.getSession().getAttribute("previousUrl") || Utils.buildContextPath(welcomePageUrl);
                res.redirect(previousUrl);
            }
        );
        app.all(loginUrl, function (req, res) {
            let errors = req["flash"]("error");
            if (errors.length > 0 && errors[0] === "Missing credentials") {
                errors = ["Votre identifiant ou votre mot de passe est incorrect"];
            }

            let props = {
                errorMessage: errors,
                previousUrl: null
            };

            // Cas d'un perte de connexion liée à un timeout
            if (req.query.previousUrl) {
                props.previousUrl = req.query.previousUrl;
            }

            // cas d'une perte de connexion liée à un timeout + F5
            if (req.getSession().getAttribute("previousUrl") && !props["previousUrl"]) {
                props.previousUrl = req.getSession().getAttribute("previousUrl");
                req.getSession().removeAttribute("previousUrl");
            }

            let locales: Array<string> = req.acceptsLanguages();

            let htmlApp = ReactDOMServer.renderToStaticMarkup(new ConnexionPage(props).render());
            let docTypeHtml: string = "<!DOCTYPE html>";
            res.setHeader("x-is-login-page", "true");
            res.send(docTypeHtml + htmlApp);
        });
        app.get(logoutUrl, function (req: Request, res, next) {
            // notifie passport
            req.logout();
            // notifie le session-manager et redirige une fois la session détruite
            req.getSession().invalidate(() => {
                res.redirect(Utils.buildContextPath(welcomePageUrl));
            });
        });

        app.use(ensureAuthenticated);
    }
}
