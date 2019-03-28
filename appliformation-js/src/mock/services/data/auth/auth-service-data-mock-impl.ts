import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { AuthService } from "src/services/data/auth/auth-service";
import { Response } from "superagent";
import { Promise } from "hornet-js-utils/src/promise-api";

const logger: Logger = Utils.getLogger("appliformation-js.mock.services.data.auth.auth-service-data-mock-impl");

/**
 * Liste des utilisateurs en mode bouchon
 * @type {any[]}
 */
const users = [
    {
        "name": "user",
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

/**
 * Implementation des services pour l'authentification
 * @class
 * @implements {AuthService}
 * @extends {ServiceApi}
 */
export class AuthServiceDataMockImpl extends AuthService {

    /**
     * recherche de l'identité
     * @param {object} data
     */
    auth(data): Promise<any> {
        logger.trace("SERVICES MOCK - auth", data);
        let user = findByUsername(data.login);
        return Promise.resolve(user);
    }

}
