import * as Sequelize from "sequelize";
import { HornetSequelizeAttributes } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";

export interface RoleUtilisateurAttributes extends HornetSequelizeAttributes {
    idRole: number;
    idUtilisateur: number;
}

export let RoleUtilisateurModel: Sequelize.DefineAttributes = {
    "idRole": {
        type: Sequelize.INTEGER,
        field: "id_role",
        primaryKey: true,
        allowNull: false,
        unique: "pk_role_utilisateur",
        references: {
            model: "RoleModel",
            key: "idRole"
        }
    },
    "idUtilisateur": {
        type: Sequelize.INTEGER,
        field: "id_utilisateur",
        primaryKey: true,
        allowNull: false,
        unique: "pk_role_utilisateur",
        references: {
            model: "UtilisateurModel",
            key: "idUtilisateur"
        }
    }
};
