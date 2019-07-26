import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";

/**
 * Liste des utilisateurs en mode bouchon
 * @type {any[]}
 */
let users = [
    {
        "name": "test",
        "roles": [{"id": 2, "name": "appliformation-js_USER"}]
    },
    {
        "name": "admin",
        "roles": [{"id": 1, "name": "appliformation-js_ADMIN"}, {"id": 2, "name": "appliformation-js_USER"}]
    }
];

function findByUsername(username) {
    for (let i = 0, len = users.length; i < len; i++) {
        let user = users[i];
        if (user.name === username) {
            return user;
        }
    }
    return null;
}

export class BouchonRoutes {

    static build(router) {
        //DEFINR LES ROUTES A BOUCHONNER

        router.post("/utilisateurs/auth", function() {
            var user = findByUsername(this.req.body.login);
            this.res.json({
                "hasTechnicalError": false,
                "hasBusinessError": false,
                "status": 200,
                "url": "url",
                "errors": [],
                "data":user});
        });

        router.post("/contact/envoyer", function() {
            this.res.json({
                "hasTechnicalError": false,
                "hasBusinessError": false,
                "status": 200,
                "url": "url",
                "errors": [],
                "data":{
                    message: "Courriel envoyé"
                }});
        });

    }
}
