import * as Sequelize from "sequelize";
import { RoleAttributes } from "src/models/model-role";
import { HornetSequelizeAttributes } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";

export interface UtilisateurAttributes extends HornetSequelizeAttributes {
    id: number;
    login: string;
    password: string;
    enabled: boolean;
    listeRole: Array<RoleAttributes>;

}

export interface UtilisateurInstance extends Sequelize.Instance<UtilisateurAttributes>, UtilisateurAttributes {

}

export let UtilisateurModel: Sequelize.DefineAttributes = {
    id: {
        type: Sequelize.INTEGER,
        field: "id_utilisateur",
        autoIncrement: true,
        primaryKey: true
    },
    login: {
        type: Sequelize.STRING(10),
        field: "uti_login"
    },
    password: {
        type: Sequelize.STRING(50),
        field: "uti_password"
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        field: "uti_enabled",
        defaultValue: "FALSE"
    }
};
