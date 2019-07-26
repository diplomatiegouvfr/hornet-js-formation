import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import Map from "hornet-js-bean/src/decorators/Map";
import { injectable } from "hornet-js-core/src/inject/injectable";
import { inject } from "hornet-js-core/src/inject/inject";
import { HornetGenericDAO } from "hornet-js-database/src/sequelize/hornet-generic-dao";
import { HornetSequelizeInstanceModel } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";
import { UtilisateurMetier } from "src/models/user-mod";
import { ModelDAO } from "src/dao/model-dao";
import { UtilisateurAttributes } from "src/models/seq-user-mod";
import { Promise } from "hornet-js-utils/src/promise-api";

const logger: Logger = Logger.getLogger("appliformation-js-lite.src.dao.utilisateurs-dao");

@injectable()
export class UtilisateursDAO extends HornetGenericDAO<ModelDAO, HornetSequelizeInstanceModel<UtilisateurAttributes>> {
    constructor(entity: string = "utilisateurEntity", @inject(ModelDAO) modelDAO?: ModelDAO) {
        super(modelDAO[entity], modelDAO);
    }

    @Map(UtilisateurMetier)
    getRole(data): Promise<UtilisateurMetier> {
        return this.entity.findOne({
                where: {
                    login: data.login,
                    password: data.password
                },
                include: [{
                    model: this.modelDAO.roleEntity,
                    as: "listeRole"
                }]
            }
        );
    }

}
