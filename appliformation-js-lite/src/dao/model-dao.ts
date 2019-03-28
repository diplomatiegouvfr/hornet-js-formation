import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { UtilisateurAttributes, UtilisateurModel } from "src/models/seq-user-mod";
import { RoleAttributes, RoleModel } from "src/models/model-role";
import { RoleUtilisateurAttributes, RoleUtilisateurModel } from "src/models/model-role_utilisateur";
import { Entity } from "hornet-js-database/src/decorators/dec-seq-entity";
import { SequelizeUtils } from "hornet-js-database/src/sequelize/sequelize-utils";
import { injectable, Scope, Side } from "hornet-js-core/src/inject/injectable";
import { HornetSequelizeModel } from "hornet-js-database/src/sequelize/hornet-sequelize-model";
import { inject } from "hornet-js-core/src/inject/inject";
import { HornetSequelizeInstanceModel } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";
import { PersonneModel, PersonneAttributes } from "src/models/seq-per.mod";

const logger: Logger = Utils.getLogger("appliformation-js-lite.src.dao.model-dao");

@injectable(ModelDAO, Scope.SINGLETON, Side.SERVER)
export class ModelDAO extends HornetSequelizeModel {

    @Entity("utilisateur", UtilisateurModel)
    public utilisateurEntity: HornetSequelizeInstanceModel<UtilisateurAttributes>;

    @Entity("role", RoleModel)
    public roleEntity: HornetSequelizeInstanceModel<RoleAttributes>;

    @Entity("role_utilisateur", RoleUtilisateurModel)
    public roleUtilisateurEntity: HornetSequelizeInstanceModel<RoleUtilisateurAttributes>;

    @Entity("personne", PersonneModel)
    public personneEntity: HornetSequelizeInstanceModel<PersonneAttributes>;

    constructor(@inject("databaseConfigName")conf?: string) {
        super(conf);
        this.initUtilisateurEntity();
        this.initRoleEntity();

    }

    /** METHODS */
    private initUtilisateurEntity(): void {
        SequelizeUtils.initRelationBelongsToMany({fromEntity: this.utilisateurEntity, toEntity: this.roleEntity, alias: "listeRole", foreignKey: "id_utilisateur", throughTable: "role_utilisateur"});
    }

    private initRoleEntity(): void {
        SequelizeUtils.initRelationBelongsToMany({fromEntity: this.roleEntity, toEntity: this.utilisateurEntity, alias: "listeUser", foreignKey: "id_role", throughTable: "role_utilisateur"});
    }
}