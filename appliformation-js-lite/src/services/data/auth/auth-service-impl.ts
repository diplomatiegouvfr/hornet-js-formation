import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { UtilisateursDAO } from "src/dao/utilisateurs-dao";
import { UtilisateurMetier } from "src/models/user-mod";
import { AuthService } from "src/services/data/auth/auth-service";
import { Response } from "superagent";
import { Promise } from "hornet-js-utils/src/promise-api";

const logger:Logger = Logger.getLogger("appliformation-js-lite.src.services.data.auth.auth-service-data-impl");

export class AuthServiceImpl extends AuthService {
    private utilisateursDAO: UtilisateursDAO = new UtilisateursDAO();

    auth(data): Promise<any> {
        return this.utilisateursDAO.getRole(data).then((utilisateur: UtilisateurMetier) => {
            return {
                "name": utilisateur.login,
                "roles": utilisateur.roles
            };
        });
    }

    listerUtilisateurs(): Promise<UtilisateurMetier[]> {
        return this.utilisateursDAO.findAllGeneric<UtilisateurMetier>(null, UtilisateurMetier);
    }

    creerUtilisateur(data): Promise<any> {
        return this.utilisateursDAO.insertGeneric(data);
    }

}
